import WaitlistForm from '../components/WaitlistForm'

export const metadata = {
  title: 'Agents | VaHome.com',
  description: 'Join the VaHome agent waitlist for Hampton Roads, Virginia.',
}

export default function AgentsPage() {
  return <WaitlistForm type="agent" title="Agents" />
}
