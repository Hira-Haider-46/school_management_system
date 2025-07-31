import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-4">
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src='/search.png' alt='Search Icon' width={14} height={14} />
                <input type="text" placeholder="Search..." className=" text-gray-600 outline-none bg-transparent p-2 w-[200px]"/>
            </div>
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src='/message.png' alt='msg' height={20} width={20} />
                </div>
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Image src='/announcement.png' alt='announcement' height={20} width={20} />
                    <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">Jhon Doe</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
                <Image src='/avatar.png' alt='avatar' height={36} width={36} className="rounded-full cursor-pointer" />
            </div>
        </nav>
    );
}

export default Navbar;