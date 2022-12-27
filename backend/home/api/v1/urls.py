from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter
import home.api.v1.viewsets.signup_signin_views as signup_signin_views

# from home.api.v1.viewsets import (
#     # SignupViewSet,
#     # LoginViewSet,
# )
from home.api.v1.viewsets import setup_profile_views, base_views, security_views, dwolla_views, transaction_views, \
    user_views
from home.api.v1.viewsets.ach_transaction_views import ACHTransactionViewSet
from home.api.v1.viewsets.contract_views import ContractViewSet
from home.api.v1.viewsets.coupons_views import CouponsView, ConsumerCouponView
from home.api.v1.viewsets.compliance_and_dashboard_views import DashboardDataView, ComplianceActionViewset
from home.api.v1.viewsets.dwolla_webhooks import views as dwolla_webhooks_views
from home.api.v1.viewsets.event_views import EventViewSet
from home.api.v1.viewsets.notification_views import SetDeviceView, NotificationViewSet
from home.api.v1.viewsets.signup_signin_views import LoginFacebookView
from home.api.v1.viewsets.transaction_views import TransactionViewSet
from home.api.v1.viewsets.user_views import UserViewSet, ConsumerViewSet, DwollaUserView

router = DefaultRouter()
router.register("event", EventViewSet, basename="event")
router.register("user", UserViewSet, basename="user")
router.register("transaction", TransactionViewSet, basename="transaction")
router.register("contract", ContractViewSet, basename="contract")
router.register("ach_transaction", ACHTransactionViewSet, basename="ach_transaction")
router.register("consumer", ConsumerViewSet, basename="consumer")
router.register("dwolla_user", DwollaUserView, basename="dwolla_user")
router.register("coupons", CouponsView, basename="coupons")
router.register("consumer-coupons", ConsumerCouponView, basename="consumer_coupons")
# router.register("signup", SignupViewSet, basename="signup")
router.register(r'notification', NotificationViewSet, 'notification')
router.register('compliance_action', ComplianceActionViewset, 'compliance_action')

urlpatterns = [
    path('set-device/', SetDeviceView.as_view(), name='api.set_device'),
    path('registration/', include([
        path('set-password/', signup_signin_views.SetPasswordView.as_view(), name='set_password'),
        path('verify-user-account/', signup_signin_views.VerifyUserAccountAPIView.as_view(), name='verify_user_account'),
        path('send-verification-code/', signup_signin_views.ResendVerificationCodeAPIView.as_view(), name='send_verifiction_code'),
    ])),
    path('social/', include([
        path('fb-login/', LoginFacebookView.as_view()),
        path('apple-login/', signup_signin_views.LoginAppleView.as_view()),
        path('google-login/', signup_signin_views.LoginGoogleView.as_view()),
    ])),
    path('set-up-profile/', include([
        path('consumer/first-step/', setup_profile_views.SetupConsumerProfileFirstStepAPIView.as_view(), name='setup_consumer_profile_first_name'),
        path('consumer/second-step/', setup_profile_views.SetupConsumerProfileSecondStepAPIView.as_view(), name='setup_consumer_profile_second_name'),
        path('consumer/', setup_profile_views.SetupConsumerProfileAPIView.as_view(), name='setup_consumer_profile'),
        path('consumer-detail/', setup_profile_views.SetupConsumerProfileDetailAPIView.as_view(), name='setup_consumer_profile_detail'),
        path('merchant/', setup_profile_views.SetupMerchantProfileAPIView.as_view(), name='setup_merchant_profile'),
        path('merchant-detail/', setup_profile_views.SetupMerchantProfileDetailAPIView.as_view(), name='setup_merchant_profile_detail'),
    ])),
    path('my-profile/', include([
        path('consumer/', setup_profile_views.ConsumerMyProfileAPIView.as_view(), name='my_profile_consumer'),
        path('merchant/', setup_profile_views.MerchantMyProfileDetailAPIView.as_view(), name='my_profile_merchant'),
    ])),
    path('security/', include([
        path('change-password/', security_views.ChangePasswordView.as_view(), name='change_password'),
        path('allow-touch-id/', security_views.AllowTouchIdView.as_view(), name='allow_touch_id'),
        path('delete-account/', security_views.DeleteAccountView.as_view(), name='delete_account'),
    ])),
    path('dwolla/', include([
        path('create-iav-token/', dwolla_views.CreateIavTokenView.as_view(), name='dwolla_iav_token'),
        path('customers/<int:id>/funding-sources/', dwolla_views.DwollaFundingSourcesByCustomerView.as_view(), name='dwolla_funding_sources_by_customer'),
        path('my-funding-sources/', dwolla_views.DwollaFundingSourcesByCustomerView.as_view(), name='dwolla_my_funding_sources'),
        path('webhook', dwolla_webhooks_views.DwollaWebhooksView.as_view(), name='dwolla_webhooks'),

    ])),
    path('base/', include([
        # path('cities/', base_views.CityListView.as_view(), name='cities'),
        # path('cities/<int:pk>/', base_views.CityRetrieveView.as_view(), name='city'),
        path('states/', base_views.StateListView.as_view(), name='states'),
        path('states/<int:pk>/', base_views.StateRetrieveView.as_view(), name='state'),
    ])),
    path('where-to-spend/', base_views.WhereToSpendView.as_view(), name='where_to_spend'),
    path('business-details/<int:pk>/', base_views.BusinessDetailsView.as_view(), name='business_details'),
    path('my-qr-code-send/', base_views.SendQrCodeView.as_view(), name='my_qr_code_send'),
    path('balances/', user_views.GetBalancesView.as_view(), name='balances'),
    path('community-chest/', base_views.CommunityChestView.as_view(), name='communitychest_info'),
    path('cashier-mode/', setup_profile_views.SetCashierModeView.as_view(), name='cashiermode'),
    path('send-money/', transaction_views.SendMoneyView.as_view(), name='send_money'),
    path('withdraw/', transaction_views.WithdrawView.as_view(), name='withdraw'),
    path('deposit/', transaction_views.DepositView.as_view(), name='deposit'),
    path('send-qr/', transaction_views.SendQRView.as_view(), name='send_qr'),
    path('send-report/', transaction_views.SendReportView.as_view(), name='send_report'),
    path('compliance/dashboard/', DashboardDataView.as_view(), name='compliance_dashboard'),
    # path('is-cashier-mode/', setup_profile_views.CashierTestView.as_view(), name='iscashiermode'),
    # path('is-cashier-mode-not/', setup_profile_views.NoCashierTestView.as_view(), name='iscashiermode'),
    path("", include(router.urls))

]
