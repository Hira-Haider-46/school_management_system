"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import InputField from "../InputField";
import { classSchema } from "@/lib/formValidationSchemas";
import { createClass, updateClass } from "@/lib/actions";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useActionState,
  useTransition,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({
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
  const form = useForm({
    resolver: zodResolver(classSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [state, formAction] = useActionState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
    const classData = {
      id: formData.id,
      name: formData.name,
      capacity: Number(formData.capacity),
      gradeId: Number(formData.gradeId),
      supervisorId: formData.supervisorId || undefined,
    };
    startTransition(() => {
      formAction(classData);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData || { teachers: [], grades: [] };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name as FieldError}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity as FieldError}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            type="hidden"
            defaultValue={data?.id?.toString()}
            register={register}
            error={errors?.id as FieldError}
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
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

export default ClassForm;
