import moment from "moment";

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export function whenAuction(auction) {
  var now = moment();
  if (moment(auction.start).isBefore(now) && moment(auction.end).isAfter(now)) {
    return "now";
  }
  if (moment(auction.start).isAfter(now)) {
    return "coming";
  }
  if (moment(auction.end).isBefore(now)) {
    return "passed";
  }
}

export function whenLot(lot) {
  var now = moment();
  if (moment(lot.start).isBefore(now) && moment(lot.end).isAfter(now)) {
    return "now";
  }
  else if (moment(lot.start).isAfter(now)) {
    return "coming";
  }
  // if (moment(lot.end).isBefore(now)) {
  //   return "passed";
  // }
  else{
    return "passed";
  }
}


export function numberWithPoint(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function isEmbryo(lot) {
  return (lot.type === "FrozenEmbryo" || lot.type === "ImplantedEmbryo");
}

export function isFrozenEmbryo(lot) {
  return (lot.type === "FrozenEmbryo");
}

export function isImplantedEmbryo(lot) {
  return (lot.type === "ImplantedEmbryo");
}

export function isFoal(lot) {
  return (lot.type === "Foal");
}

export function isYearling(lot) {
  return (lot.type === "Yearling");
}

export function isYoungHorse(lot) {
  return (lot.type === "YoungHorse");
}

export function isBroodmareFull(lot) {
  return (lot.type === "BroodmareFull");
}

export function isBroodmareEmpty(lot) {
  return (lot.type === "BroodmareEmpty");
}

export function isStallion(lot) {
  return (lot.type === "Stallion");
}


