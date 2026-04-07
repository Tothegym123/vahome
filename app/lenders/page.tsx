import WaitlistForm from '../components/WaitlistForm'

export const metadata = {
  title: 'Lenders | VaHome.com',
  description: 'Join the VaHome lender waitlist for Hampton Roads, Virginia.',
}

export default function LendersPage() {
  return <WaitlistForm type="lender" title="Lenders" />
}
