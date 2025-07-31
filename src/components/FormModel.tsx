"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { JSX, useState } from "react";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

const FormModel = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
      ? "bg-[#C3EBFA]"
      : "bg-[#CFCEFF]";

  const [open, setOpen] = useState(false);

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form action="" className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center cursor-pointer">
            Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      if (forms[table] && typeof forms[table] === "function") {
        return forms[table](type, data);
      } else {
        return (
          <div className="p-4 text-center">
            <h1 className="text-xl font-semibold mb-4">
              {type === "create"
                ? `Add New ${table.charAt(0).toUpperCase() + table.slice(1)}`
                : `Update ${table.charAt(0).toUpperCase() + table.slice(1)}`}
            </h1>
            <p className="text-red-500 mb-4">
              {type === "create"
                ? `Add form for "${table}" is not yet implemented.`
                : `Update form for "${table}" is not yet implemented.`}
            </p>
            <p className="text-gray-600 text-sm">
              Please contact the development team to add this form.
            </p>
          </div>
        );
      }
    }

    return <div className="p-4 text-center text-red-500">Form not found!</div>;
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor} cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModel;