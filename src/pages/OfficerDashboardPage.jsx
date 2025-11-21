import Header from '../components/Header';

export default function OfficerDashboardPage() {
    return (
        <div>
            <Header AdminView={true} />
            <div className="p-8">
                <h1 className="text-3xl font-bold">Loan Officer Dashboard</h1>
                <p>Welcome to your Officer dashboard!</p>
            </div>
        </div>
    );
}