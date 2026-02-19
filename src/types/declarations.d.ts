declare module '*.jsx' {
  const component: any;
  export default component;
}

declare module './context/AuthContext' {
  export const AuthProvider: React.FC<{ children: React.ReactNode }>;
  export const useAuth: () => any;
}

declare module './components/ProtectedRoute' {
  const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }>;
  export default ProtectedRoute;
}

declare module './components/Auth/Login' {
  const Login: React.FC;
  export default Login;
}

declare module './components/Auth/Register' {
  const Register: React.FC;
  export default Register;
}

declare module './components/Dashboard/Dashboard' {
  const Dashboard: React.FC;
  export default Dashboard;
}

declare module './components/Transactions/Deposit' {
  const Deposit: React.FC;
  export default Deposit;
}

declare module './components/Transactions/Withdraw' {
  const Withdraw: React.FC;
  export default Withdraw;
}

declare module './components/Transactions/Transfer' {
  const Transfer: React.FC;
  export default Transfer;
}

declare module './components/Transactions/TransactionHistory' {
  const TransactionHistory: React.FC;
  export default TransactionHistory;
}

declare module './components/Profile/Profile' {
  const Profile: React.FC;
  export default Profile;
}

declare module './components/Admin/AdminDashboard' {
  const AdminDashboard: React.FC;
  export default AdminDashboard;
}

declare module './components/Admin/UserManagement' {
  const UserManagement: React.FC;
  export default UserManagement;
}

declare module './components/Admin/AuditLogs' {
  const AuditLogs: React.FC;
  export default AuditLogs;
}