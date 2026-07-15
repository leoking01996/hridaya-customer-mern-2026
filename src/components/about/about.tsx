import Navigation from "@/components/nav/Navigation";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
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

function About() {
  return (
    <>
      <Navigation />

      <motion.section
        className="bg-[#F9F6F2] py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto  px-6 max-w-6xl">

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
              className="text-5xl md:text-6xl font-light text-gray-900 mb-5"
            >
              About Hridaya
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-600 max-w-3xl mx-auto text-lg leading-8"
            >
              Hridaya is more than a candle brand, it is a celebration of warmth,
              mindfulness, and meaningful moments. Every candle is crafted to
              transform everyday spaces into peaceful sanctuaries.
            </motion.p>
          </motion.div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -80, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                 src={`https://res.cloudinary.com/feqmtduq/image/upload/bd7d72f6-d38e-4efe-946a-f299c891dee5_j1h1ib.png`}
                alt="Hridaya Candle"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>

            {/* Story */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-semibold mb-8">
                Our Story
              </h2>

              <p className="text-gray-600 leading-8 mb-6">
                Inspired by the Sanskrit word <strong>Hridaya</strong>,
                meaning <strong>"Heart"</strong>, our journey began with a
                simple mission to create handcrafted candles that bring peace,
                warmth, and elegance into every home.
              </p>

              <p className="text-gray-600 leading-8 mb-6">
                Every candle is thoughtfully hand-poured using premium wax,
                luxurious fragrances, and sustainable materials to create an
                unforgettable sensory experience.
              </p>

              <p className="text-gray-600 leading-8">
                Whether you are celebrating life's special moments or simply
                unwinding after a busy day, Hridaya candles are designed to
                illuminate every meaningful memory.
              </p>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-24"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <motion.div
              variants={fadeUp}
              whileHover={{
                y: -10,
                scale: 1.05,
              }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-5xl mb-5">🌿</div>

              <h3 className="text-2xl font-semibold mb-4">
                Natural Quality
              </h3>

              <p className="text-gray-600 leading-7">
                Crafted with premium soy wax, clean-burning cotton wicks,
                and luxurious fragrance oils for a healthier and longer burn.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              whileHover={{
                y: -10,
                scale: 1.05,
              }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-5xl mb-5">🕯️</div>

              <h3 className="text-2xl font-semibold mb-4">
                Handmade
              </h3>

              <p className="text-gray-600 leading-7">
                Every candle is hand-poured with care, ensuring exceptional
                craftsmanship and attention to every detail.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              whileHover={{
                y: -10,
                scale: 1.05,
              }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-5xl mb-5">❤️</div>

              <h3 className="text-2xl font-semibold mb-4">
                Made with Heart
              </h3>

              <p className="text-gray-600 leading-7">
                Our passion is to create candles that fill your home with
                comfort, joy, and unforgettable memories.
              </p>
            </motion.div>

          </motion.div>

          {/* Bottom Quote */}
          <motion.div
            className="text-center mt-24"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Light Your Moments with Hridaya
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every flame tells a story. Every fragrance creates a memory.
              Discover candles that bring warmth, elegance, and serenity into
              your everyday life.
            </p>
          </motion.div>

        </div>
      </motion.section>
    </>
  );
}

export default About;