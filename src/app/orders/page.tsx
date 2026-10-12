import { redirect } from "next/navigation";

/** Orders are private to the signed-in account — not a public page. */
export default function OrdersIndexRedirect() {
  redirect("/account/orders");
}
