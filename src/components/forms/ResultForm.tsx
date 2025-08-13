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
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ResultForm = ({
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
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    startTransition(() => {
      formAction(data as ResultSchema);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students, exams, assignments } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Score"
          name="score"
          type="number"
          defaultValue={data?.score}
          register={register}
          error={errors?.score as FieldError}
        />
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
        {exams && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Exam (Optional)</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("examId")}
              defaultValue={data?.examId}
            >
              <option value="">Select an exam</option>
              {exams.map((exam: { id: number; title: string }) => (
                <option value={exam.id} key={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
            {errors.examId && (
              <p className="text-xs text-red-400">
                {errors.examId.message?.toString()}
              </p>
            )}
          </div>
        )}
        {assignments && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">
              Assignment (Optional)
            </label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("assignmentId")}
              defaultValue={data?.assignmentId}
            >
              <option value="">Select an assignment</option>
              {assignments.map((assignment: { id: number; title: string }) => (
                <option value={assignment.id} key={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </select>
            {errors.assignmentId && (
              <p className="text-xs text-red-400">
                {errors.assignmentId.message?.toString()}
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

export default ResultForm;
