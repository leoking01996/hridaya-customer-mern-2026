import { Route, useLocation,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { XMarkIcon } from "@heroicons/react/24/solid";
import { jsPDF } from "jspdf";
import logo from '@/assets/logo.png'
import autoTable from "jspdf-autotable";

interface CartItem {
  id: number;
  name: string;
  image: string;
 
  qty: number;
  price: number;
  total_price: number;
  size:number;
  color:string;
  fragrance:string;
}
interface Summary {
  subtotal: number;
  discount: number;
  discountType: "fixed" | "percentage" | null;
  discountValue: number;
  total: number;
}
interface UserData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  profile_pic?: any | File; //
  address?: string;
}
function Checkout() {
  const location = useLocation();
const navigate = useNavigate();
  const cartItems: CartItem[] = location.state?.cartIds || [];
  const [preview, setPreview] = useState<string>("");
    const token = sessionStorage.getItem("token");
  const totalAmount: number = location.state?.totalAmount || 0;
    const user_iid = location.state?.user_id || "";
//   const user_id: number = location.state?.userId || 0;
const[userDatass,setuserDatass]=useState<UserData|null>(null);
const [summary, setSummary] = useState<any>(null);
const [couponCode, setCouponCode] = useState("");

const [user ,setUser]=useState({
      full_name: "",
  phone_no: "",
  email: "",
  address: ""
})
const [formData,setFormData]=useState<UserData>({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    profile_pic: "",
    address: "",
    id:''
})
const[user_id,setUser_id]=useState()
  const [paymentMethod, setPaymentMethod] = useState("cod");
const [userData, setUserData] = useState<UserData | null>(null);
  const [cartList, setCartList] = useState<CartItem[]>([]);
const[isEditClicked,setisEditClicked]=useState(false);


  useEffect(() => {
   console.log(cartItems,'cartItems5555')

    const userData = sessionStorage.getItem('user');
    console.log('userdataasdsadasd',JSON.parse(userData));
    
setuserDatass(JSON.parse(userData));
    const userId = JSON.parse(userData).id;
    setUser_id(userId);
  getUserData();
 
fetchCart();
handleCheckout();
  }, []);
  const fetchCart = async () => {
  try {
 
    if (!user_iid) return;

  

    const res = await fetch(
      `https://hridaya-customer-backend-production.up.railway.app/api/auth/getCartList/${user_iid}`
    );

    const data = await res.json();

    console.log("cart response:", data);

    if (data.success) {
      const formattedCart = data.data.map((item: any) => ({
        ...item,
        qty: Number(item.quantity),
        price: Number(item.amount),
        image: `https://hridaya-customer-backend-production.up.railway.app/uploads/${item.image}`,
      }));
toast.success(data.message);
const selectedCartItems = formattedCart.filter((item: any) =>
  cartItems.includes(item._id)
)
      setCartList(selectedCartItems);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Error fetching cart:", error);
  }
};
  const getUserData =async ( )=>{
    const token = sessionStorage.getItem("token");
    try{
const res = await fetch(
  `https://hridaya-customer-backend-production.up.railway.app/api/auth/user/${user_iid}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
 const data =await res.json();
 console.log('66666666',data.user)

 setUser({
      full_name: data.user.full_name,
  phone_no: data.user.phone,
  email: data.user.email,
  address: data.user.address
 })
 setFormData({

        full_name: data.user.full_name,
  phone: data.user.phone_no,
  email: data.user.email,
  address: data.user.address,
    date_of_birth: data.user.date_of_birth,
    profile_pic: data.user.profile_pic,
    id:data.user.id
 })
    }catch{

    }
  }
const handleCheckout = async () => {
  const res = await fetch("https://hridaya-customer-backend-production.up.railway.app/api/auth/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cart_items: cartItems,
      coupon_code: couponCode, // 👈 send code only
    }),
  });

  const data = await res.json();

  setSummary(data);
};
const edit =()=>{
  console.log(userDatass)
  if (userDatass) {
    setFormData({
      id: userDatass.id,
      full_name: userDatass.full_name || "",
      email: userDatass.email || "",
      phone: userDatass.phone || "",
      // date_of_birth: userData.date_of_birth || "",
      profile_pic: userDatass.profile_pic || "",
      address: userDatass.address || "",
    });

    // set preview image
    setPreview(userDatass.profile_pic || "");
  }

  setisEditClicked(true);

}
const cancle = ()=>{
  setisEditClicked(false);
}
// const handelPlaceOrder = async () => {
// const token = sessionStorage.getItem("token");
//   const payload = {
//     user_id: user_id,
//     payment_method: paymentMethod,
//     cart_items: cartItems,
  
//   };

//   try {
//     const res = await fetch(
//       "https://hridaya-customer-backend-production.up.railway.app/api/auth/place-order",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//              Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload)
//       }
//     );

//     const data = await res.json();
// const orderdList = cartItems.map(list=>list.name)
// console.log('cartItems',orderdList);

// if (data.status === "success") {
//   confirmAlert({
//     customUI: ({ onClose }) => {
//       return (
//         <div style={{
//           backgroundColor: "#fff9f0",
//           borderRadius: "15px",
//           padding: "30px",
//           maxWidth: "400px",
//           margin: "0 auto",
//           textAlign: "center",
//           boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
//           fontFamily: "'Arial', sans-serif"
//         }}>
//           <h2 style={{ color: "#f97316", fontSize: "1.5rem", marginBottom: "10px" }}>
//             {data.message}
//           </h2>
//           <p style={{ marginBottom: "20px", color: "#333" }}>
//             Your order: <strong>{cartItems.map(c => c.name).join(", ")}</strong> has been successfully placed!
//           </p>

//           <button
//             onClick={() => downloadPDF(user, cartItems, totalAmount)}
//             style={{
//               marginRight: "10px",
//               padding: "10px 20px",
//               borderRadius: "8px",
//               backgroundColor: "#f97316",
//               color: "#fff",
//               border: "none",
//               fontWeight: "bold",
//               cursor: "pointer"
//             }}
//           >
//             Download Bill
//           </button>

//           <button
//             onClick={() => {
//               onClose();
//               navigate("/");
//             }}
//             style={{
//               padding: "10px 25px",
//               borderRadius: "8px",
//               backgroundColor: "#4CAF50",
//               color: "#fff",
//               border: "none",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//           >
//             OK
//           </button>
//         </div>
//       );
//     }
//   });
// } else {
//       toast.error(data.message||"Order failed ❌");
      
//     }

//   } catch (error) {
//     toast.error("Server error ❌");
//   }
// };


// const downloadPDF = async (user: any, cartItems: any[], totalAmount: number) => {
//   const doc = new jsPDF();

//   // Fetch logo and convert to base64
//   const getBase64FromUrl = async (url: string) => {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const logoBase64 = await getBase64FromUrl(logo);

//   // Add logo as background (watermark)
//   doc.addImage(logoBase64, "PNG", 50, 100, 100, 100); // x, y, width, height

//   // Title
//   doc.setFontSize(22);
//   doc.setTextColor(243, 115, 22); // orange
//   doc.text("Hridaya Order Receipt", 105, 40, { align: "center" });

//   // User Details
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);
//   doc.text(`Name: ${user.full_name}`, 20, 60);
//   doc.text(`Email: ${user.email}`, 20, 68);
//   doc.text(`Phone: ${user.phone_no}`, 20, 76);
//   doc.text(`Address: ${user.address}`, 20, 84);

//   // Order Table Header
//   doc.setFontSize(14);
//   doc.text("Order Items:", 20, 100);

//   let startY = 108;
//   cartItems.forEach((item, index) => {
//     doc.setFontSize(12);
//     doc.text(
//       `${index + 1}. ${item.name} | Qty: ${item.qty} | Price: Rs.${item.price} | Total: Rs.${item.total_price}`,
//       20,
//       startY
//     );
//     doc.text(
//       `Size: ${item.size} | Color: ${item.color} | Fragrance: ${item.fragrance}`,
//       20,
//       startY + 6
//     );
//     startY += 14;
//   });

//   // Total Amount
//   doc.setFontSize(14);
//   doc.setTextColor(0, 128, 0);
//   doc.text(`Total Amount: Rs.${totalAmount}`, 20, startY + 10);

//   // Footer
//   doc.setFontSize(10);
//   doc.setTextColor(150, 150, 150);
//   doc.text("Thank you for shopping with Hridaya!", 105, startY + 30, { align: "center" });

//   // Save PDFFbuy
//   doc.save(`Hridaya_Order_${Date.now()}.pdf`);
// };

const handelPlaceOrder = async () => {

  const token = sessionStorage.getItem("token");
console.log('cartItems',cartItems)
  // Convert cart objects to only Mongo IDs
  const cart_ids = cartItems;

  const payload = {
    cart_ids,
    coupon_code: couponCode,
    payment_method: paymentMethod,
  };

  try {

    const res = await fetch(
      "https://hridaya-customer-backend-production.up.railway.app/api/auth/place-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    console.log(data.order.items);
    console.log(data.order.total_amount);

    if (data.success) {

   confirmAlert({
  customUI: ({ onClose }) => {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          width: "420px",
          borderRadius: "15px",
          padding: "30px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          border: "3px solid #f97316",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            color: "#22c55e",
            marginBottom: "10px",
          }}
        >
          ✅
        </div>

        <h2
          style={{
            color: "#f97316",
            marginBottom: "10px",
          }}
        >
          {data.message}
        </h2>

        <p
          style={{
            color: "#555",
            marginBottom: "20px",
          }}
        >
          Your order has been placed successfully.
        </p>

        <p
          style={{
            color: "#333",
            fontWeight: "bold",
            marginBottom: "25px",
          }}
        >
          Products:
          <br />
          {data.order.items.map((item) => item.name).join(", ")}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <button
            onClick={() =>
              downloadPDF(
                user,
          data
              )
            }
            style={{
              backgroundColor: "#f97316",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📄 Download Bill
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/");
            }}
            style={{
              backgroundColor: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 30px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  },
});

    } else {

      toast.error(data.message);

    }

  } catch (err) {

    console.log(err);

    toast.error("Server Error");

  }

};

// const downloadPDF = async (user: any, cartItems: any[], totalAmount: number) => {
//   console.log('cartItems',cartItems)
//   console.log('totalAmount',totalAmount)
//   const doc = new jsPDF();

//   // Fetch logo and convert to base64
//   const getBase64FromUrl = async (url: string) => {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const logoBase64 = await getBase64FromUrl(logo);

//   // ---- Add Hridaya watermark ----
//   doc.setFontSize(60);
//   doc.setTextColor(200, 200, 200); // light gray
//   doc.setFont("helvetica", "bold");
//   doc.text("Hridaya", 105, 150, { align: "center", angle: 45 });

//   // ---- Add logo at top ----
//   doc.addImage(logoBase64, "PNG", 80, 10, 50, 50);

//   // ---- Title ----
//   doc.setFontSize(22);
//   doc.setTextColor(243, 115, 22);
//   doc.setFont("helvetica", "bold");
//   doc.text("Hridaya Order Receipt", 105, 70, { align: "center" });

//   // ---- User Details ----
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Name: ${user.full_name}`, 20, 85);
//   doc.text(`Email: ${user.email}`, 20, 93);
//   doc.text(`Phone: ${user.phone_no}`, 20, 101);
//   doc.text(`Address: ${user.address}`, 20, 109);

//   // ---- Order Items ----
//   doc.setFontSize(14);
//   doc.text("Order Items:", 20, 125);

//   let startY = 133;
//   cartItems.forEach((item, index) => {
//     doc.setFontSize(12);
//     doc.text(
//       `${index + 1}. ${item.name} | Qty: ${item.qty} | Price: Rs.${item.price} | Total: Rs.${item.total_price}`,
//       20,
//       startY
//     );
//     doc.text(
//       `Size: ${item.size} | Color: ${item.color} | Fragrance: ${item.fragrance}`,
//       20,
//       startY + 6
//     );
//     startY += 14;
//   });

//   // ---- Delivery Status (dynamic position) ----
//   startY += 10; // small gap after items
//   doc.setFontSize(14);
//   doc.setTextColor(243, 115, 22); // optional color
//   doc.text("Delivery Status: Pending", 20, startY);

//   // ---- Total Amount ----
//   startY += 10;
//   doc.setFontSize(14);
//   doc.setTextColor(0, 128, 0);
//   doc.text(`Total Amount: Rs.${totalAmount}`, 20, startY);

//   // ---- Footer ----
//   doc.setFontSize(10);
//   doc.setTextColor(150, 150, 150);
//   doc.text("Thank you for shopping with Hridaya!", 105, startY + 30, { align: "center" });

//   // ---- Save PDF ----
//   doc.save(`Hridaya_Order_${Date.now()}.pdf`);
// };

const downloadPDF = async (
  user: any,
  orderDatas:any

) => {
//         data.order.items,
//                 data.order.total_amount,
//                  data.discount,
// data.shippingCharge



console.log(orderDatas,'orderDatas')

  const cartItems = orderDatas.order.items;
    const discount = orderDatas.order.discount;
  const shippingCharge = orderDatas.order.shipping_charge;
  const totalAmount= orderDatas.order.total_amount;

console.log(discount,'discount')
console.log(shippingCharge,'shippingCharge')
console.log(totalAmount,'totalAmount')

  const doc = new jsPDF();

  // Convert image to Base64
  const getBase64FromUrl = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result as string);

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  };

  const logoBase64 = await getBase64FromUrl(logo);

  // ---------------- Watermark ----------------

  doc.setTextColor(235, 235, 235);
  doc.setFontSize(55);
  doc.text("HRIDAYA", 105, 170, {
    align: "center",
    angle: 45,
  });

  // ---------------- Logo ----------------

  doc.addImage(logoBase64, "PNG", 82, 10, 45, 45);

  // ---------------- Title ----------------

  doc.setFontSize(22);
  doc.setTextColor(243, 115, 22);
  doc.setFont("helvetica", "bold");

  doc.text("ORDER RECEIPT", 105, 65, {
    align: "center",
  });

  // ---------------- User ----------------

  doc.setFontSize(12);
  doc.setTextColor(0);

  doc.setFont("helvetica", "normal");

  doc.text(`Customer : ${user.full_name}`, 15, 80);
  doc.text(`Email      : ${user.email}`, 15, 88);
  doc.text(`Phone      : ${user.phone_no || "-"}`, 15, 96);
  doc.text(`Address   : ${user.address || "-"}`, 15, 104);

  // ---------------- Date ----------------

  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    140,
    80
  );

  // ---------------- Table ----------------

  autoTable(doc, {
    startY: 115,

    head: [
      [
        "#",
        "Product",
        "Size",
        "Color",
        "Fragrance",
        "Qty",
        "Price",
        "Total",
      ],
    ],

body: (cartItems ?? []).map((item, index) => [
  index + 1,
  item.name,
  item.size,
  item.color,
  item.fragrance,
  item.quantity,
  `Rs. ${item.amount}`,
  `Rs. ${item.quantity * item.amount}`,
]),

    theme: "grid",

    headStyles: {
      fillColor: [243, 115, 22],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    bodyStyles: {
      fontSize: 10,
    },

    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // ---------------- Summary ----------------

  doc.setFontSize(14);

  doc.setTextColor(243, 115, 22);

  doc.text("Delivery Status :", 15, finalY);

  doc.setTextColor(0);

  doc.text("Pending", 65, finalY);

  doc.setTextColor(0, 128, 0);

  doc.setFont("helvetica", "bold");
  doc.text(
    `Discount : Rs.${discount}`,
    15,
    finalY + 12
  );

  doc.setTextColor(255, 0, 0);
    doc.text(
    `Shipping Charge : Rs.${shippingCharge}`,
    15,
    finalY + 20
  );

  doc.setTextColor(0, 0, 0);
  doc.text(
    `Grand Total : Rs.${totalAmount}`,
    15,
    finalY + 28
  );



  // ---------aaaaaaa------- Footersssss ----------------

  doc.setDrawColor(200);

  doc.line(15, finalY + 22, 195, finalY + 22);

  doc.setFontSize(11);

  doc.setTextColor(120);

  doc.text(
    "Thank you for shopping with HRIDAYA",
    105,
    finalY + 35,
    {
      align: "center",
    }
  );

  doc.text(
    "www.hridaya.com",
    105,
    finalY + 42,
    {
      align: "center",
    }
  );

  doc.save(`Hridaya_Order_${Date.now()}.pdf`);
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = sessionStorage.getItem("token");

    const formDataToSend = new FormData();

    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);

    // profile image (IMPORTANT)
    if (formData.profile_pic instanceof File) {
      formDataToSend.append("profilePic", formData.profile_pic);
    }

    const response = await fetch(
      "https://hridaya-customer-backend-production.up.railway.app/api/auth/update-profile",
      {
        method: "PUT", // ✅ correct
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend, // ✅ correct
      }
    );

    const result = await response.json();

    if (result.success) {
      setUserData(result.user);
      setisEditClicked(false);

      setUser({
        full_name: result.user.full_name,
        phone_no: result.user.phone,
        email: result.user.email,
        address: result.user.address,
      });

      sessionStorage.setItem("user", JSON.stringify(result.user));
    } else {
      alert(result.message || "Update failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };


    const applyCoupon = async () => {
  const res = await fetch("https://hridaya-customer-backend-production.up.railway.app/api/auth/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cart_items: cartItems,
      coupon_code: couponCode,
    }),
  });

  const data = await res.json();
  setSummary(data);
};
  return (
    <div className="max-w-6xl mx-auto mt-40 px-4">

      {/* <h2 className="text-3xl font-bold mb-8 text-center">
        Checkout
      </h2> */}
 <h2 className="text-4xl mb-10 md:text-5xl text-center font-light tracking-tight">Checkout</h2>
      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-8">

 
  {!isEditClicked&&(
<>
 {/* Address */}
  <div className="bg-white shadow-md rounded-xl p-6">
<div className="flex justify-between items-center">
  <h3 className="text-xl font-semibold mb-4">
    Shipping Detail
  </h3>

  <p onClick={edit} className="text-blue-500 cursor-pointer hover:underline">
    Edit
  </p>
</div>

  

    <div className="space-y-4">

      <div>
        <p className="text-sm text-gray-500">Full Name</p>
        <p className="font-medium">{user.full_name || "—"}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Phone Number</p>
        <p className="font-medium">{user.phone_no || "—"}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-medium">{user.email || "—"}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Full Address</p>
        <p className="font-medium">{user.address || "—"}</p>
      </div>

    </div>
  </div>
</>
  )}

  {isEditClicked&&(
    
      
   <div className="max-w-md mx-auto mt-5 p-6 bg-white rounded-2xl shadow-lg">

    <XMarkIcon
  className="w-5 h-5 text-gray-600 hover:text-white  hover:bg-gray-600 rounded float-right cursor-pointer transition-transform duration-200 ease-in-out"
  onClick={cancle}
/>
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit User Form</h2>   

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
         <input
  type="text"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter phone number"
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  required
/>
        </div>


        {/* Profile Pic (optional) */}
     {/* Profile Pic (choose file) */}


        {/* Address (optional) */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Address (optional)</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 rounded-full mt-4 hover:opacity-90 transition"
        >
          Edit
        </button>
    <button
      type="button"
      className="w-full max-w-xs mx-auto block bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 rounded-full mt-4 hover:opacity-90 transition"
      onClick={cancle}
    >
      Cancel
    </button>
      </form>
    </div>
   

)}

</div>

        {/* RIGHT SIDE */}
   <div className="bg-white shadow-md rounded-xl p-6">

  <h3 className="text-xl font-semibold mb-4">
    Order Summary
  </h3>

  <div className="space-y-4 max-h-80 overflow-y-auto">

    {cartList.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between border-b pb-3"
      >
        <div className="flex items-center gap-3">

          <img
            src={`https://res.cloudinary.com/feqmtduq/image/upload/hridaya/${item.image.split("/").pop()}`}
            className="w-16 h-16 object-cover rounded-lg"
          />

          <div>
        <div>    <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-700">
             <strong> Qty:</strong> {item.qty} * <strong> Per Price :</strong> {item.price}
            </p></div>
              <div>   
            <p className="text-sm text-gray-700">
             <strong> Size :</strong> {item.size}  <strong> Color :</strong> {item.color}  <strong> fragrance :</strong> {item.fragrance} 
            </p></div>
          </div>

        </div>

        <div className="font-semibold">
          Rs. {item.qty *item.price}
        </div>
      </div>
    ))}

  </div>
<div className="mt-6 border-t pt-4">

  <h3 className="text-lg font-semibold mb-3">
    Apply Coupon
  </h3>

  <div className="flex gap-3">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      placeholder="Enter coupon code"
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

  <button
  onClick={applyCoupon}
  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
>
  Apply  
</button>
  </div>

</div>
  {/* TOTAL */}
 <div className="mt-6 space-y-3 border-t pt-4">

  {/* Subtotal */}
  <div className="flex justify-between text-lg">
    <span>Subtotal</span>
    <span>Rs. {summary?.subtotal ?? 0}</span>
  </div>

  {/* Discount */}
  <div className="flex justify-between text-lg text-red-500">
    <span>
      Discount{" "}
      {summary?.discountType === "percentage"
        ? `(${summary?.discountValue}%)`
        : "(Fixed)"}
    </span>
    <span>- Rs. {summary?.discount ?? 0}</span>
  </div>
  <div className="flex justify-between text-lg">
    <span>Shipping Charge</span>
    <span>Rs. {summary?.shippingCharge ?? 0}</span>
  </div>
  {/* Divider */}
  <div className="border-t pt-2"></div>

  {/* Total (your original style upgraded) */}
  <div className="flex justify-between mt-2 text-xl font-bold">
    <span>Total</span>
    <span className="text-green-600">
      Rs. {summary?.total ?? totalAmount}
    </span>
  </div>

</div>

  {/* PAYMENT METHOD */}
  <div className="mt-6 border-t pt-4">
    <h3 className="text-lg font-semibold mb-3">
      Payment Method
    </h3>

    <div className="space-y-2">

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={() => setPaymentMethod("cod")}
        />
        Cash on Delivery
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="esewa"
          checked={paymentMethod === "esewa"}
          onChange={() => setPaymentMethod("esewa")}
        />
        eSewa
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="khalti"
          checked={paymentMethod === "khalti"}
          onChange={() => setPaymentMethod("khalti")}
        />
        Khalti
      </label>

    </div>
  </div>

  {/* PLACE ORDER */}
  <button onClick={handelPlaceOrder} className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold">
    Place Order
  </button>

</div>

      </div>

    </div>
    
  );
}

export default Checkout;