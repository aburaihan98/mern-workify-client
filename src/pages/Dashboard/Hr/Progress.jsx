import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

function Progress() {
  const axiosSecure = useAxiosSecure();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // employee Name
  const { data: employeeName = [], isLoading } = useQuery({
    queryKey: ["employeeName"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/employeeWorkSheet/name");
      const uniqueNames = Array.from(
        new Map(data.map((item) => [item.name, item])).values()
      );
      return uniqueNames;
    },
  });

  // employee WorkSheet
  const { data: employeeWorkSheet = [] } = useQuery({
    queryKey: ["employeeWorkSheet", selectedEmployee, selectedMonth],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/employeeWorkSheet?employeeName=${selectedEmployee}&month=${selectedMonth}`
      );
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8 min-h-screen mx-auto shadow-lg ">
      <h1 className="text-4xl font-semibold mb-8 text-center">
        Employee Work Progress
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        {/* Employee Dropdown */}
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium mb-2">Employee</label>
          <select
            className="text-primary w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="allEmployees">All Employees</option>
            {employeeName.map((employee) => (
              <option key={employee._id} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium mb-2">Month</label>
          <select
            className="w-full text-primary px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>

      {/* Table to show work records */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="">
            <tr>
              <th className="px-6 py-3 font-semibold text-center">ID</th>
              <th className="px-6 py-3 font-semibold text-center">
                Employee Name
              </th>
              <th className="px-6 py-3 font-semibold text-center">
                Work Sheet
              </th>
              <th className="px-6 py-3 font-semibold text-center">
                Hours Worked
              </th>
              <th className="px-6 py-3 font-semibold text-center">Date</th>
            </tr>
          </thead>
          <tbody className="">
            {employeeWorkSheet.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No records found
                </td>
              </tr>
            ) : (
              employeeWorkSheet.map((record, index) => (
                <tr key={record._id} className="border-t">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">{record.name}</td>
                  <td className="px-6 py-4 text-center">{record.tasks}</td>
                  <td className="px-6 py-4 text-center">
                    {record.hoursWorked}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {new Date(record.selectedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Progress;
