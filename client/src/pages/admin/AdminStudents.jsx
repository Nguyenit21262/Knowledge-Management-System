import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getUsers, updateStudentStatus } from "../../api/users.js";
import { formatDate } from "../../utils/formatters.js";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStudentId, setActiveStudentId] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);

      try {
        const data = await getUsers({ role: "student" });
        setStudents(data);
      } catch (error) {
        toast.error(error.message || "Failed to load students.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const activeCount = useMemo(
    () => students.filter((student) => student.isActive).length,
    [students],
  );

  const handleToggleStatus = async (student) => {
    const nextStatus = !student.isActive;

    try {
      setActiveStudentId(student.id);
      const response = await updateStudentStatus(student.id, nextStatus);

      setStudents((currentStudents) =>
        currentStudents.map((currentStudent) =>
          currentStudent.id === student.id
            ? { ...currentStudent, ...response.user }
            : currentStudent,
        ),
      );
    } catch (error) {
      toast.error(error.message || "Failed to update student status.");
    } finally {
      setActiveStudentId(null);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2.2rem] lg:text-[2.5rem]">
        Students
      </h1>
      <p className="mt-3 max-w-2xl text-[1rem] text-slate-500 sm:text-[1.08rem]">
        Activate or deactivate student accounts from the knowledge hub.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <article className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <p className="text-[0.9rem] font-medium uppercase tracking-[0.06em] text-slate-500">
            Total Students
          </p>
          <p className="mt-3 text-[2rem] font-medium text-slate-950">
            {isLoading ? "..." : students.length}
          </p>
        </article>

        <article className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <p className="text-[0.9rem] font-medium uppercase tracking-[0.06em] text-slate-500">
            Active
          </p>
          <p className="mt-3 text-[2rem] font-medium text-slate-950">
            {isLoading ? "..." : activeCount}
          </p>
        </article>

        <article className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <p className="text-[0.9rem] font-medium uppercase tracking-[0.06em] text-slate-500">
            Inactive
          </p>
          <p className="mt-3 text-[2rem] font-medium text-slate-950">
            {isLoading ? "..." : students.length - activeCount}
          </p>
        </article>
      </section>

      <section className="mt-8 overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:mt-10">
        {isLoading ? (
          <div className="px-8 py-10 text-center text-slate-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="px-8 py-10 text-center text-slate-500">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Student
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Email
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Joined
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Status
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const isUpdating = activeStudentId === student.id;

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-5 sm:px-6 lg:px-8">
                        <div>
                          <p className="text-[1rem] font-medium text-slate-950">
                            {student.name}
                          </p>
                          <p className="mt-1 text-[0.88rem] text-slate-400">
                            Student
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-[0.95rem] text-slate-600 sm:px-6 lg:px-8">
                        {student.email}
                      </td>
                      <td className="px-5 py-5 text-[0.95rem] text-slate-500 sm:px-6 lg:px-8">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-5 py-5 sm:px-6 lg:px-8">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[0.88rem] ${
                            student.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-5 sm:px-6 lg:px-8">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleToggleStatus(student)}
                          className={`rounded-full px-4 py-2 text-[0.9rem] font-medium transition ${
                            student.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {isUpdating
                            ? "Saving..."
                            : student.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminStudents;
