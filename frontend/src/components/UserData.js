import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Skeleton from "@mui/material/Skeleton";
import Logout from "./Logout";
import transition from "../transition";
function calculateAttendanceMargin(attendedClasses, totalClasses) {
  const attendancePercentage = (attendedClasses / totalClasses) * 100;
  const requiredAttendance = 0.75 * totalClasses;
  const margin = Math.ceil(requiredAttendance - attendedClasses);

  if (attendancePercentage > 75) {
    return (
      <span
        className="text-purple-600 text-xl"
        style={{ fontFamily: "JetBrains Mono" }}
      >
        Margin: {Math.abs(margin)}
      </span>
    );
  } else {
    return (
      <span
        className="text-rose-600 text-xl"
        style={{ fontFamily: "JetBrains Mono" }}
      >
        Required: {Math.abs(margin)}
      </span>
    );
  }
}
function UserData() {
  const [attData, setAttData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 2000 });

    const storedData = localStorage.getItem("attData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log(parsedData);
      setAttData(parsedData);
    }
  }, []);

  const n = 13;

  return (
    <div>
      <Logout />
      <div className="justify-center bg-gradient-to-tr from-sky-400 to-blue-500 sm:px-16 lg:px-48 py-4">
        {attData.length
          ? attData.map((item, index) => (
              <div
                className="sm:w-fit lg:w-full mx-8 my-8"
                key={item.id || index}
              >
                <div
                  className="xt-card rounded-2xl text-white xt-links-default bg-black my-4"
                  data-aos="fade-up"
                  data-aos-anchor-placement="top-bottom"
                >
                  <div className="p-3 sm:p-9 text-base">
                    <div
                      className="text-3xl pb-2 font-semibold"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      {item.Title || <Skeleton animation="wave" />}
                    </div>
                    <div className="pl-2">
                      <p
                        className="text-emerald-400 text-xl"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        Attended: {item.Conducted - item.Absent}
                      </p>
                      <p
                        className="text-orange-600 text-xl"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        Conducted: {item.Conducted}
                      </p>
                      <p
                        className="text-yellow-300 text-xl"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        Attendance: {item.Attn} %
                      </p>
                      <p>
                        {calculateAttendanceMargin(
                          item.Conducted-item.Absent,
                          item.Conducted
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : [...Array(n)].map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton animation="wave" variant="rounded" height={120} />
                <br />
              </React.Fragment>
            ))}
      </div>
    </div>
  );
}

export default transition(UserData);
