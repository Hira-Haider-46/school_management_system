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
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LessonForm = ({
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
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    startTransition(() => {
      formAction(data as LessonSchema);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects, classes, teachers } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update the lesson"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name as FieldError}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day}
          >
            <option value="">Select a day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
          {errors.day && (
            <p className="text-xs text-red-400">
              {errors.day.message?.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime as FieldError}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime as FieldError}
        />
        {subjects && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Subject</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("subjectId")}
              defaultValue={data?.subjectId}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject: { id: number; name: string }) => (
                <option value={subject.id} key={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <p className="text-xs text-red-400">
                {errors.subjectId.message?.toString()}
              </p>
            )}
          </div>
        )}
        {classes && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Class</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("classId")}
              defaultValue={data?.classId}
            >
              <option value="">Select a class</option>
              {classes.map((classItem: { id: number; name: string }) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
            {errors.classId && (
              <p className="text-xs text-red-400">
                {errors.classId.message?.toString()}
              </p>
            )}
          </div>
        )}
        {teachers && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Teacher</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("teacherId")}
              defaultValue={data?.teacherId}
            >
              <option value="">Select a teacher</option>
              {teachers.map(
                (teacher: { id: string; name: string; surname: string }) => (
                  <option value={teacher.id} key={teacher.id}>
                    {teacher.name} {teacher.surname}
                  </option>
                )
              )}
            </select>
            {errors.teacherId && (
              <p className="text-xs text-red-400">
                {errors.teacherId.message?.toString()}
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

export default LessonForm;
