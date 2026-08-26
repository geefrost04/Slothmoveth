import { redirect } from 'next/navigation';

export default function CoffeeSuccessPage() {
  // Keep old Checkout sessions working without another synchronous Stripe API call.
  redirect('/courses/police_admin/math?coffee=thanks');
}
