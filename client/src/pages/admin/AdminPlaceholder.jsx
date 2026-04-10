import React from "react";

const AdminPlaceholder = ({ title }) => {
  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2.2rem] lg:text-[2.5rem]">
        {title}
      </h1>

      <section className="mt-8 rounded-md border border-slate-200 bg-white px-5 py-8 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        <p className="text-[1rem] font-normal text-slate-500 sm:text-[1.05rem]">
          This admin section is hard-coded for now and will be connected to the
          backend later.
        </p>
      </section>
    </main>
  );
};

export default AdminPlaceholder;
