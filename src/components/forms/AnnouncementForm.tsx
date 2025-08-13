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
  announcementSchema,
  AnnouncementSchema,
} from "@/lib/formValidationSchemas";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AnnouncementForm = ({
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
    resolver: zodResolver(announcementSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    startTransition(() => {
      formAction(data as AnnouncementSchema);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Announcement has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { classes } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new announcement"
          : "Update the announcement"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Announcement Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title as FieldError}
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("description")}
            defaultValue={data?.description}
            rows={3}
          />
          {errors.description && (
            <p className="text-xs text-red-400">
              {(errors.description as FieldError).message?.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Date"
          name="date"
          type="datetime-local"
          defaultValue={data?.date}
          register={register}
          error={errors?.date as FieldError}
        />
        {classes && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Class (Optional)</label>
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
                {(errors.classId as FieldError).message?.toString()}
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

export default AnnouncementForm;
