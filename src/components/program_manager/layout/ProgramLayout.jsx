
import { Outlet } from 'react-router-dom';

export default function ProgramLayout() {
    return (
        <div className="h-screen w-full overflow-y-auto p-4 md:p-6">
            <Outlet />
        </div>
    );
}