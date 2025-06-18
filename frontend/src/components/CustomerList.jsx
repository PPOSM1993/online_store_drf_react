import React, { useState } from "react";

import { Sidebar, Header, CustomerTable } from "../index.js";

const CustomerList = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);


    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);






    return (
        <div className="min-h-screen bg-blue-100 flex flex-col md:flex-row">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className="flex-1 md:ml-64">
                <Header />
                <main className="p-4 sm:p-6">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Clientes</h1>
                    <CustomerTable />

                </main>
            </div>
        </div>
    );
};

export default CustomerList;