"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import InputField from "../InputField";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useActionState,
  useTransition,
} from "react";
import {
  attendanceSchema,
  AttendanceSchema,
} from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createAttendance : updateAttendance,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    startTransition(() => {
      formAction(data as AttendanceSchema);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Attendance has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students, lessons } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new attendance record"
          : "Update the attendance record"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Date"
          name="date"
          type="datetime-local"
          defaultValue={data?.date}
          register={register}
          error={errors?.date as FieldError}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Present</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("present")}
            defaultValue={data?.present?.toString()}
          >
            <option value="">Select attendance</option>
            <option value="true">Present</option>
            <option value="false">Absent</option>
          </select>
          {errors.present && (
            <p className="text-xs text-red-400">
              {errors.present.message?.toString()}
            </p>
          )}
        </div>
        {students && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Student</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("studentId")}
              defaultValue={data?.studentId}
            >
              <option value="">Select a student</option>
              {students.map(
                (student: { id: string; name: string; surname: string }) => (
                  <option value={student.id} key={student.id}>
                    {student.name} {student.surname}
                  </option>
                )
              )}
            </select>
            {errors.studentId && (
              <p className="text-xs text-red-400">
                {errors.studentId.message?.toString()}
              </p>
            )}
          </div>
        )}
        {lessons && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Lesson</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("lessonId")}
              defaultValue={data?.lessonId}
            >
              <option value="">Select a lesson</option>
              {lessons.map(
                (lesson: {
                  id: number;
                  name: string;
                  subject: { name: string };
                }) => (
                  <option value={lesson.id} key={lesson.id}>
                    {lesson.name} ({lesson.subject.name})
                  </option>
                )
              )}
            </select>
            {errors.lessonId && (
              <p className="text-xs text-red-400">
                {errors.lessonId.message?.toString()}
              </p>
            )}
          </div>
        )}
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button
        className="bg-blue-400 text-white p-2 rounded-md cursor-pointer hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Loading..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AttendanceForm;
