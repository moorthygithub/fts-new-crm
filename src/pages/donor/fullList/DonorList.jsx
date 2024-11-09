import React, {  useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import {
  IconEdit,
  IconEye,
  IconReceipt,
} from "@tabler/icons-react";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";


import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import AddIndivisual from "./AddIndivisual";
import AddCompany from "./AddCompany";

const DonorList = () => {
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type_id");
  const [columnVisibility, setColumnVisibility] = useState({
    indicomp_spouse_name: false,
    indicomp_com_contact_name: false,
    indicomp_fts_id: false,
  });


  const [individualDrawer, setIndividualDrawer] = useState(false);
  const [companyDrawer, setCompanyDrawer] = useState(false);
  const [receiptDrawer, setReceiptDrawer] = useState(false);

  const toggleIndividualDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIndividualDrawer(open);
  };

  const toggleCompanyDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setCompanyDrawer(open);
  };
  const toggleReceiptDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setReceiptDrawer(open);
  };

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonorData(response.data?.individualCompanies);
    } catch (error) {
      console.error("Error fetching Factory data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    fetchDonorData();
    
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "indicomp_fts_id",
        header: "Fts Id",
        isVisible: columnVisibility.indicomp_fts_id,
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Full Name",
      },
      {
        accessorKey: "indicomp_type", 
        header: "Type",
      },
      {
        accessorKey: "indicomp_spouse_name",
        header: "Spouse",
        isVisible: columnVisibility.indicomp_spouse_name,
      },
      {
        accessorKey: "indicomp_com_contact_name",
        header: "Contact",
        isVisible: columnVisibility.indicomp_com_contact_name,
      },
      {
        accessorKey: "spouse_contact",
        header: "Spouse/Contact",
        Cell: ({ value, row }) => {
          const indicompType = row.original.indicomp_type;
          const spouseRow = row.original?.indicomp_spouse_name;
          const contactRow = row.original?.indicomp_com_contact_name;
          if (indicompType === "Individual") {
            return spouseRow;
          } else {
            return contactRow;
          }
        },
      },
      {
        accessorKey: "indicomp_mobile_phone",
        header: "Mobile",
      },
      {
        accessorKey: "indicomp_email",
        header: "Email",
        Cell: ({ value, row }) => {
          console.log("Row Data:", row.original?.indicomp_email);
          const valueData = row.original?.indicomp_email;
          console.log("value", value);
          return (
            <div
              className={` ${
                valueData ? "bg-green-500" : ""
              } rounded-lg text-white p-[1px] px-2 `}
            >
              {valueData}
            </div>
          );
        },
      },
      {
        id: "id",
        header: "Action",
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              <div
                onClick={() => navigate(`/donor-edit/${id}`)}
                className="flex items-center space-x-2"
              >
                <IconEdit title="Edit" className="h-5 w-5 cursor-pointer" />
              </div>

              <div
                onClick={() => navigate(`/donor-view/${id}`)}
                className="flex items-center space-x-2"
              >
                <IconEye title="View" className="h-5 w-5 cursor-pointer" />
              </div>
              {userType == "1" ? (
                <div
                  onClick={() => navigate(`/create-receipts/${id}`)}
                  className="flex items-center space-x-2"
                >
                  <IconReceipt
                    title="Reciept"
                    className="h-5 w-5 cursor-pointer"
                  />
             
                </div>
              ) : (
                ""
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: donorData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <>
      <Layout>
        <div className="max-w-screen">
          <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
            <h1 className="border-b-2  font-[400] border-dashed border-orange-800">
              Donor List
            </h1>
            <div className="flex gap-2">
               <button
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={toggleIndividualDrawer(true)}
              >
                + Individual
              </button>
              <SwipeableDrawer
                anchor="right"
                open={individualDrawer}
                onClose={toggleIndividualDrawer(false)}
                onOpen={toggleIndividualDrawer(true)}
              >
                <AddIndivisual onClose={toggleIndividualDrawer(false)} fetchDonorData={fetchDonorData} />
              </SwipeableDrawer>
              <div>
              <button
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={toggleCompanyDrawer(true)}
              >
                + Company
              </button>
                    <SwipeableDrawer
                anchor="right"
                open={companyDrawer}
                onClose={toggleCompanyDrawer(false)}
                onOpen={toggleCompanyDrawer(true)}
              >
                <AddCompany onClose={toggleCompanyDrawer(false)} fetchDonorData={fetchDonorData} />
              </SwipeableDrawer>
              </div>
              

             
            </div>
          </div>
          <div className=" shadow-md">
            <MantineReactTable table={table} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DonorList;
