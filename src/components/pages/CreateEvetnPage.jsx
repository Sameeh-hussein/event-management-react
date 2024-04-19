import Container from "@mui/material/Container";
import { Box, Typography, Grid } from "@mui/material";
import InputField, {
  ControlledOpenSelect,
  DateField,
  ImageField,
  TicketsFieldArray,
  TimeField,
} from "../other/CreateEventCpmponents/InputField";
import MultiStepForm, { FormStep } from "../forms/multiStepForm/MultiStepForm";
import dayjs from "dayjs";
import MyTabs from "../other/CreateEventCpmponents/MyTabs";
import { useCreateEvent, useGetCategories } from "../../API/createEventApi";
import {
  validationSchemaStepOne,
  validationSchemaStepThree,
  validationSchemaStepTwo,
} from "../other/CreateEventCpmponents/validationSchemas";
import utc from "dayjs/plugin/utc";

import { styled } from "@mui/system";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const MainBox = styled("div")(({ theme }) =>
  theme.unstable_sx({
    mt: 4,
    p: 4,
    width: "100%",
    height: "fit-contents",
    borderRadius: "10px",
    outline: "#eeedf2 2px solid",
    "&:hover": { outline: "#3659e3 2px solid" },
  })
);

const MainTitle = styled(Typography)(({ theme }) =>
  theme.unstable_sx({
    fontWeight: "600",
    mb: 5,
  })
);

export default function CreateEvetnPage() {
  const { data, isLoading } = useGetCategories();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYW5pbmk4NiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFobWFkYW5pbmk4NkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJPcmdhbml6ZXIiLCJleHAiOjE3MTI3MTc0NjcsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.752qhRBA8gUJzQK9cJiSe5Cdmu_FWftpHh8z_Lk-ras";

  const { mutateAsync, isPending, error, isError, isSuccess } =
    useCreateEvent(token);

  const handelValues = (values) => {
    dayjs.extend(utc); // extend dayjs with utc plugin
    const formData = new FormData();
    if (values.allowedGender || values.maxAge || values.minAge) {
      values.isManaged = true;
    }

    const formattedTickets = values.tickets.map((ticket) => {
      const { startSale, endSale, startSaleTime, endSaleTime, ...rest } =
        ticket;
      const formattedStartSale = new Date(
        `${dayjs(ticket.startSale).format("YYYY-MM-DD")}T${dayjs(
          ticket.startSaleTime
        ).format("HH:mm:ss")}`
      ).toISOString();

      const formattedEndSale = new Date(
        `${dayjs(ticket.endSale).format("YYYY-MM-DD")}T${dayjs(
          ticket.endSaleTime
        ).format("HH:mm:ss")}`
      ).toISOString();

      return {
        ...rest,
        startSale: formattedStartSale,
        endSale: formattedEndSale,
        price: Number(rest.price),
        quantity: Number(rest.quantity),
      };
    });

    const startDateUtc = new Date(
      `${dayjs(values.startDate).format("YYYY-MM-DD")}T${dayjs(
        values.startTime
      ).format("HH:mm:ss")}`
    ).toISOString();

    const endDateUtc = new Date(
      `${dayjs(values.endDate).format("YYYY-MM-DD")}T${dayjs(
        values.endTime
      ).format("HH:mm:ss")}`
    ).toISOString();

    console.log(startDateUtc.substring(0, 10));
    console.log(startDateUtc.substring(11, startDateUtc.length - 1));
    console.log(endDateUtc.substring(0, 10));
    console.log(endDateUtc.substring(11, startDateUtc.length - 1));

    // Step 1
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("thumbnail", values.Thumbnail);
    formData.append("startDate", startDateUtc.substring(0, 10));
    formData.append("endDate", endDateUtc.substring(0, 10));
    formData.append(
      "startTime",
      startDateUtc.substring(11, startDateUtc.length - 1) + "1"
    );
    formData.append(
      "endTime",
      endDateUtc.substring(11, startDateUtc.length - 1) + "1"
    );

    formData.append("lat", values.lat);
    formData.append("lon", values.lon);
    formData.append("street", values.street);
    formData.append("isOnline", values.isOnline);
    formData.append("categoryId", values.categoryId);

    // Step 2
    formData.append("tickets", JSON.stringify(formattedTickets));

    // Step 3
    formData.append("isManaged", values.isManaged);
    formData.append("allowedGender", values.allowedGender);
    formData.append("maxAge", values.maxAge);
    formData.append("minAge", values.minAge);

    return formData;
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Event Created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [isSuccess]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="primary" size={"70px"} />
      </Backdrop>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ p: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "600", mb: 1 }}>
            Build your event page
          </Typography>
          <p>sakhags</p>

          <Typography
            variant="h6"
            color="initial"
            sx={{ opacity: 0.75, mb: 5 }}
          >
            Add all of your event details and let attendees know what to expect
          </Typography>
          {isError && (
            <Alert variant="standard" severity="error" sx={{ mb: 2 }}>
              {error.response.data.detail}
            </Alert>
          )}
          <MultiStepForm
            initialValues={{
              name: "",
              description: "",
              Thumbnail: "",
              startDate: "",
              endDate: "",
              startTime: "",
              endTime: "",
              lat: 51.505,
              lon: -0.09,
              street: "",
              isOnline: false,
              categoryId: "",
              //----step 2--------
              tickets: [
                {
                  name: "",
                  price: "",
                  quantity: "",
                  startSale: "",
                  endSale: "",
                  startSaleTime: "",
                  endSaleTime: "",
                },
              ],
              //----step 3--------
              isManaged: false,
              allowedGender: "",
              maxAge: "",
              minAge: "",
            }}
            onSubmit={(values) => {
              const formData = handelValues(values);
              mutateAsync(formData);
            }}
          >
            <FormStep
              stepName={"Event Overview"}
              onSubmit={() => console.log("step 1 is submit")}
              validationSchema={validationSchemaStepOne}
            >
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <ImageField name="image" />
                </Grid>
                {/* Event Overview section */}
                <MainBox>
                  <MainTitle variant="h5" color="initial">
                    Event Overview
                  </MainTitle>

                  <Grid container rowSpacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
                        Event title
                      </Typography>
                      <InputField name="name" label="Title" />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
                        Event Details
                      </Typography>

                      <InputField name="description" label="Description" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="initial" sx={{ mb: 1 }}>
                        Event category
                      </Typography>

                      <ControlledOpenSelect
                        name="categoryId"
                        label="category"
                        options={data}
                      />
                    </Grid>
                  </Grid>
                </MainBox>
                {/* Event Date and Time section */}
                <MainBox>
                  <MainTitle variant="h5" color="initial">
                    Event Date and Time
                  </MainTitle>

                  <Grid
                    container
                    rowSpacing={1}
                    sx={{ rowSpacing: 1 }}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
                        Date
                      </Typography>
                    </Grid>
                    <Grid item xs={11.8} sm={5.8}>
                      <DateField
                        name="startDate"
                        label={"Start Date"}
                        minDate={dayjs().add(1, "day")}
                      />
                    </Grid>
                    <Grid item xs={11.8} sm={5.8}>
                      <DateField
                        name="endDate"
                        label={"End Date"}
                        minDate={dayjs().add(1, "day")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
                        Time
                      </Typography>
                    </Grid>
                    <Grid item xs={11.8} sm={5.8}>
                      <TimeField name="startTime" label={"Start time"} />
                    </Grid>
                    <Grid item xs={11.8} sm={5.8}>
                      <TimeField name="endTime" label={"End Time"} />
                    </Grid>
                  </Grid>
                </MainBox>
                {/* Event Loacation section */}
                <MainBox>
                  <MainTitle variant="h5" color="initial">
                    Event Loacation
                  </MainTitle>

                  <Grid
                    container
                    rowSpacing={1}
                    columnGap={2}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={12}>
                      <MyTabs />
                    </Grid>
                  </Grid>
                </MainBox>
              </Grid>
            </FormStep>

            <FormStep
              stepName={"Event Tikits"}
              onSubmit={() => console.log("step 2 is submit")}
              validationSchema={validationSchemaStepTwo}
            >
              <TicketsFieldArray name="tickets" />
            </FormStep>

            <FormStep
              stepName={"Event restrictions"}
              onSubmit={() => console.log("step 3 is submit")}
              validationSchema={validationSchemaStepThree}
            >
              <MainBox>
                <MainTitle variant="h5" color="initial">
                  Restrictions
                </MainTitle>

                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={2}
                  justifyContent={"space-between"}
                >
                  <Grid item xs={12}>
                    <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
                      Age
                    </Typography>
                    <Typography variant="body2" color="#585163" sx={{ mb: 2 }}>
                      You can specify the age of the attendee
                    </Typography>
                  </Grid>
                  <Grid item xs={5.8}>
                    <InputField name="minAge" label="Min Age" numeric={true} />
                  </Grid>
                  <Grid item xs={5.8}>
                    <InputField name="maxAge" label="Max Age" numeric={true} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
                      Gender
                    </Typography>
                    <Typography variant="body2" color="#585163" sx={{ mb: 2 }}>
                      You can specify the age of the attendee
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <ControlledOpenSelect
                      name="allowedGender"
                      label="Gender"
                      options={[
                        { id: 1, value: "Male" },
                        { id: 2, value: "Female" },
                      ]}
                    />
                  </Grid>
                </Grid>
              </MainBox>
            </FormStep>
          </MultiStepForm>
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
}