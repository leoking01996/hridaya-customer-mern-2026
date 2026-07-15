import Navigation from "@/components/nav/Navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";



function ContactUs() {

    const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        "https://hridaya-customer-backend-production.up.railway.app/api/auth/sendMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        setFormData({
          full_name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };
  return (
    <>
      <Navigation />

      <motion.section
        className="bg-[#F9F6F2] py-20 overflow-hidden min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Heading */}
          <motion.div
            className="text-center mt-16 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-light mb-5"
            >
              Contact Us
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              We'd love to hear from you. Whether you have questions about our
              candles, orders, or collaborations, our team is here to help.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
               src={`https://res.cloudinary.com/feqmtduq/image/upload/Gemini_Generated_Image_if8t8qif8t8qif8t_htlhae.png`}
                alt="Contact Hridaya"
                className="rounded-3xl shadow-xl w-full h-[650px] object-cover"
              />
            </motion.div>

            {/* Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-3xl font-semibold mb-8">
                  Send us a Message
                </h2>

               <form onSubmit={handleSubmit} className="space-y-5">

      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500"
        required
      />

      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500"
      />

      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Subject"
        className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500"
        required
      />

      <textarea
        rows={5}
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Write your message..."
        className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold transition"
      >
        Send Message
      </button>

    </form>

                <div className="border-t mt-10 pt-8 space-y-5">

                  <div className="flex items-center gap-4">
                    <MapPin className="text-amber-600" size={22} />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">
                        Kathmandu, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="text-amber-600" size={22} />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">
                        +977 98XXXXXXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="text-amber-600" size={22} />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">
                        support@hridaya.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Clock className="text-amber-600" size={22} />
                    <div>
                      <p className="font-semibold">Working Hours</p>
                      <p className="text-gray-600">
                        Sunday - Friday<br />
                        9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>

          {/* Google Map */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="rounded-3xl overflow-hidden shadow-xl">

              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
                className="w-full h-[450px]"
                loading="lazy"
              />

            </div>
          </motion.div>

        </div>
      </motion.section>
    </>
  );
}

export default ContactUs;