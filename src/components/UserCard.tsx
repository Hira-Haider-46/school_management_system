import Image from "next/image";

const UserCard = ({type}: {type: string}) => {
    return (
        <div className="rounded-2xl odd:bg-[#CFCEFF] even:bg-[#FAE27C] p-4 flex-1">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">2025/26</span>
                <Image src='/more.png' alt='more' height={20} width={20} />
            </div>
            <h1 className="text-2xl font-semibold my-4">1234</h1>
            <h2 className="capitalize font-medium text-gray-500 text-sm">{type}</h2>
        </div>
    )
}

export default UserCard;