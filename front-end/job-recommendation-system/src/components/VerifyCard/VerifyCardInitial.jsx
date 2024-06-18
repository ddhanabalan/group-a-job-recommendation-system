import LoadingButton from '@mui/lab/LoadingButton';
export default function VerifyCardInitial({callAPI,loading}) {
    return (
        <div className="verification-body">
            <LoadingButton loadingIndicator="Verifying…"
                variant="contained"
                color="success"
                className='verify-btn'
                onClick={callAPI}
                loading={loading}>
                <span> Verify your account</span>
            </LoadingButton>
            <p>If you did not initiate the account registration process, please report to <a href='mailto:customercare@CareerGO.com'>customercare@CareerGO.com</a></p>
        </div>
    )
}