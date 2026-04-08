import React from "react";

const AdminPlaceholder = ({ title }) => {
  return (
    <main className="px-8 py-10">
      <h1 className="text-[2.5rem] font-medium tracking-tight text-slate-950">
        {title}
      </h1>

      <section className="mt-8 rounded-md border border-slate-200 bg-white px-8 py-10 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
        <p className="text-[1.05rem] font-normal text-slate-500">
          This admin section is hard-coded for now and will be connected to the
          backend later.
        </p>
      </section>
    </main>
  );
};

export default AdminPlaceholder;
