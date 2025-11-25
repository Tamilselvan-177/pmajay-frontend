import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OfficerDashboard from './pages/OfficerDashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import PrimeMinisterDashboard from './pages/PrimeMinisterDashboard';
import NoAccess from './pages/NoAccess';
import PrivateRoute from './components/PrivateRoute';
import SubmitDocument from './pages/SubmitDocument';
import DocumentReview from './pages/DocumentReview';
import ProjectsList from './pages/ProjectDetails';
import VillageProjectDashboard from './pages/VillageProjectDashboard';
import ProjectDetails from "./pages/ProjectDetails";
import CollectorWorkPackages from "./pages/CollectorWorkPackages";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Officer (Block/District Officer) Routes */}
        <Route
          path="/officer"
          element={
            <PrivateRoute allowedRoles={['officer']}>
              <OfficerDashboard />
            </PrivateRoute>
          }
          
        />
        <Route
  path="/officer/project/:projectId/work-packages"
  element={
    <PrivateRoute allowedRoles={["officer"]}>
      <DocumentReview />
    </PrivateRoute>
  }
/>
        <Route
          path="/officer/submit-document"
          element={
            <PrivateRoute allowedRoles={['officer']}>
              <SubmitDocument />
            </PrivateRoute>
          }
        />
<Route path="/officer/project/:projectId" element={<ProjectDetails />} />

        {/* <Route
          path="/officer/projects"
          element={
            <PrivateRoute allowedRoles={['officer']}>
              <ProjectsList />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/officer/projects/village/:villageId"
          element={
            <PrivateRoute allowedRoles={['officer']}>
              <VillageProjectDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/officer/document/:id"
          element={
            <PrivateRoute allowedRoles={['officer']}>
              <DocumentReview />
            </PrivateRoute>
          }
        />

        {/* Collector Routes */}
        <Route
          path="/collector"
          element={
            <PrivateRoute allowedRoles={['collector']}>
              <CollectorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/collector/document/:id"
          element={
            <PrivateRoute allowedRoles={['collector']}>
              <DocumentReview />
            </PrivateRoute>
          }
        />
        <Route path="/collector/work-packages/:projectId" element={<CollectorWorkPackages />} />

        <Route
          path="/collector/projects"
          element={
            <PrivateRoute allowedRoles={['collector']}>
              <ProjectsList />
            </PrivateRoute>
          }
        />

        {/* Prime Minister Routes */}
        <Route
          path="/primeminister"
          element={
            <PrivateRoute allowedRoles={['primeminister']}>
              <PrimeMinisterDashboard />
            </PrivateRoute>
          }
        />

        {/* No Access Route */}
        <Route path="/no-access" element={<NoAccess />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;