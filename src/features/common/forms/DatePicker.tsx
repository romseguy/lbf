import "react-datepicker/dist/react-datepicker.min.css";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import React from "react";
import { fr } from "date-fns/locale";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { styled } from "twin.macro";

const ReactDatePickerStyles = styled.span(
  ({ isBrowser }: { isBrowser: boolean }) => [
    `
  .react-datepicker {
  }

  // .react-datepicker__navigation-icon--next:before, react-datepicker__navigation-icon--previous:before{
  //   border: 0 !important;
  // }

  .react-datepicker__time-list-item--disabled {
    display: none;
  }

  .react-datepicker__day {
    //width: 24px !important;
    margin: unset;
  }
  .react-datepicker__day-name {
    //width: 24px !important;
    margin: unset;
  }

  .react-datepicker__month-container {
    width: 250px !important;
  }
  .react-datepicker__month {
    margin: unset;
  }

  .react-datepicker__time-container {
    width: unset !important;
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box {
    width: unset;
  }
  // ul.react-datepicker__time-list > li {
  //   padding: unset !important;
  // }

  `,
    isBrowser &&
      `
  .react-datepicker__navigation--next {
    background: url(/images/arrow-right.png) no-repeat;
  }
  .react-datepicker__navigation--previous {
    background: url(/images/arrow-left.png) no-repeat;
  }
  .react-datepicker__navigation--previous,
  .react-datepicker__navigation--next {
    width: 15px;
    height: 15px;
    border: none;
    top: 12px;
  }

  `
  ]
);

// placeholderText={format(new Date(), "dd/MM/yyyy")}
type DatePickerProps = ReactDatePickerProps;
// {
//       minDate?: Date;
//       maxDate?: Date;
//       placeholderText?: string;
//       value?: string;
//     }

export const DatePicker = ({
  // minDate,
  // maxDate,
  // onChange,
  // placeholderText,
  // selected,
  //refP,
  ...datePickerProps
}: DatePickerProps) => {
  return (
    <ReactDatePickerStyles isBrowser={isBrowser}>
      <ReactDatePicker
        // ref={ref}
        // selected={selected}
        // onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale={fr}
        timeCaption="h"
        onChangeRaw={(e) => e.preventDefault()}
        // showMonthDropdown
        // showYearDropdown
        // dropdownMode="select"
        // minDate={minDate}
        // maxDate={maxDate}
        // placeholderText={placeholderText}
        {...datePickerProps}
      />
    </ReactDatePickerStyles>
  );
};
