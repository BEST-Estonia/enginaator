import {redirect} from 'next/navigation';

export default function AdminPage() {
    //Redirect to login when someone visits /admin
    redirect('/admin/login');
}