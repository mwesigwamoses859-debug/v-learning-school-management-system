export default function AttendanceHeatmap(_props:{totalStudentsCount?:number;selectedClass?:string;onSelectDayDetails?:(day:any)=>void}){
 return <section className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-bold">Attendance records</h3><p className="mt-3 text-sm text-slate-500">Open Attendance to record and view actual student attendance.</p></section>;
}
