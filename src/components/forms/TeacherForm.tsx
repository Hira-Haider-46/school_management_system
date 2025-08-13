"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useActionState,
  useTransition,
} from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const TeacherForm = ({
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
    resolver: zodResolver(teacherSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useActionState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    startTransition(() => {
      formAction({ ...data, img: img?.secure_url } as TeacherSchema);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData || { subjects: [] };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update the teacher"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username as FieldError}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email as FieldError}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password as FieldError}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name as FieldError}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname as FieldError}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone as FieldError}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address as FieldError}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType as FieldError}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={
            data?.birthday ? data.birthday.toISOString().split("T")[0] : ""
          }
          register={register}
          error={errors.birthday as FieldError}
          type="date"
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
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjects")}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
        {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== "your-cloud-name" ? (
          <CldUploadWidget
            uploadPreset="school"
            onSuccess={(result: any, { widget }: any) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }: any) => {
              return (
                <div
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/upload.png" alt="" width={28} height={28} />
                  <span>Upload a photo</span>
                </div>
              );
            }}
          </CldUploadWidget>
        ) : (
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Image upload disabled (Cloudinary not configured)</span>
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

export default TeacherForm;
