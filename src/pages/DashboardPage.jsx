import Header from '../components/Header';

export default function DashboardPage() {
    return (
        <div>
            <Header AdminView={true} />
            <div className="p-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
}