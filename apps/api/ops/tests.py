from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.models import User, AllowedEmail
from ops.models import AuditLog

class TeamCollaboratorInvitationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # 1. Super Administrator
        self.admin = User.objects.create_user(
            email="admin@astraietm.in",
            password="testpassword123",
            full_name="Chief Administrator",
            role="ADMIN",
            is_staff=True,
            is_superuser=True
        )
        self.admin_token = str(RefreshToken.for_user(self.admin).access_token)
        
        # 2. Volunteer Staff (scanner)
        self.volunteer = User.objects.create_user(
            email="scanner@astraietm.in",
            password="testpassword123",
            full_name="Gate Scanner",
            role="VOLUNTEER",
            is_staff=True,
            is_superuser=False
        )
        self.volunteer_token = str(RefreshToken.for_user(self.volunteer).access_token)

        # 3. Standard Non-Staff User
        self.normal_user = User.objects.create_user(
            email="student@university.edu",
            password="testpassword123",
            full_name="Standard Student",
            role="USER",
            is_staff=False
        )
        self.user_token = str(RefreshToken.for_user(self.normal_user).access_token)

    def test_valid_invitation(self):
        """Admin successfully invites a new email as VOLUNTEER"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'newvolunteer@gmail.com', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['email'], 'newvolunteer@gmail.com')
        self.assertEqual(response.data['role'], 'VOLUNTEER')
        self.assertTrue(AllowedEmail.objects.filter(email='newvolunteer@gmail.com', role='VOLUNTEER').exists())

    def test_valid_admin_invitation(self):
        """Admin successfully invites another ADMIN"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'coadmin@college.ac.in', 'role': 'ADMIN'},
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['email'], 'coadmin@college.ac.in')
        self.assertEqual(response.data['role'], 'ADMIN')
        self.assertTrue(AllowedEmail.objects.filter(email='coadmin@college.ac.in', role='ADMIN').exists())

    def test_email_normalization_and_trim(self):
        """Email should be trimmed and normalized to lower case"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': '  TestUser@Domain.COM  ', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['email'], 'testuser@domain.com')
        self.assertTrue(AllowedEmail.objects.filter(email='testuser@domain.com').exists())

    def test_invalid_email_format(self):
        """Rejects malformed emails with helpful safe message"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'not-an-email', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Please enter a valid email address.')
        self.assertEqual(response.data['code'], 'invalid_email')

    def test_empty_email(self):
        """Rejects empty email"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': '   ', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Please enter a valid email address.')

    def test_unauthenticated_request(self):
        """Rejects unauthenticated requests with 401"""
        response = self.client.post(
            '/operations/team/',
            {'email': 'someone@test.com', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 401)

    def test_unauthorized_role_assignment(self):
        """Volunteer cannot invite an ADMIN"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.volunteer_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'rogueadmin@test.com', 'role': 'ADMIN'},
            format='json'
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'You do not have permission to invite this role.')

    def test_duplicate_invitation_pending(self):
        """Rejects invitation if email is already in AllowedEmail"""
        AllowedEmail.objects.create(email='pending@test.com', role='VOLUNTEER')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'pending@test.com', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'An invitation is already pending for this email.')
        self.assertEqual(response.data['code'], 'already_invited')

    def test_existing_team_member(self):
        """Rejects invitation if user is already an active staff member"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': self.volunteer.email, 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'This user is already a team member.')
        self.assertEqual(response.data['code'], 'already_member')

    def test_existing_user_promoted(self):
        """If email belongs to an existing standard USER, promotes them immediately to staff"""
        self.assertFalse(self.normal_user.is_staff)
        self.assertEqual(self.normal_user.role, 'USER')

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': self.normal_user.email, 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 201)

        self.normal_user.refresh_from_db()
        self.assertTrue(self.normal_user.is_staff)
        self.assertEqual(self.normal_user.role, 'VOLUNTEER')

    def test_invalid_role_choice(self):
        """Rejects arbitrary role strings"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'hack@test.com', 'role': 'SUPER_USER_INVENTED'},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Invalid role permission specified.')

    def test_delete_team_member(self):
        """Deleting an allowed email removes whitelist and revokes staff access"""
        # Create an allowed email for an existing staff user
        allowed = AllowedEmail.objects.create(email=self.volunteer.email, role='VOLUNTEER')
        self.assertTrue(self.volunteer.is_staff)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.delete(f'/operations/team/{allowed.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(AllowedEmail.objects.filter(id=allowed.id).exists())

        self.volunteer.refresh_from_db()
        self.assertFalse(self.volunteer.is_staff)
        self.assertEqual(self.volunteer.role, 'USER')

    def test_prevent_self_delete(self):
        """Admin cannot delete their own team member record"""
        allowed = AllowedEmail.objects.create(email=self.admin.email, role='ADMIN')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.delete(f'/operations/team/{allowed.id}/')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'You cannot remove your own administrator account.')

    def test_audit_logs_recorded(self):
        """Verifies audit logs are generated on invite and delete"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(
            '/operations/team/',
            {'email': 'audited@test.com', 'role': 'VOLUNTEER'},
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        allowed_id = response.data['id']

        invite_log = AuditLog.objects.filter(action="Added Team Member", details__icontains="audited@test.com").first()
        self.assertIsNotNone(invite_log)
        self.assertEqual(invite_log.user, self.admin)

        delete_res = self.client.delete(f'/operations/team/{allowed_id}/')
        self.assertEqual(delete_res.status_code, 204)

        delete_log = AuditLog.objects.filter(action="Removed Team Member", details__icontains="audited@test.com").first()
        self.assertIsNotNone(delete_log)
        self.assertEqual(delete_log.user, self.admin)
