<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function index()
    {
        $laporan = Peminjaman::latest()->get();

        return Inertia::render('Laporan/IndexLaporan', [
            'laporan' => $laporan,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function exportPDF(Request $request)
    {
        $laporan = $this->getFilteredData($request);
        
        $pdf = Pdf::loadView('layouts.pdf.laporan', compact('laporan')); 
        return $pdf->download('laporan-peminjaman.pdf');
    }

    public function exportExcel(Request $request)
    {
        $laporan = $this->getFilteredData($request);
        
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        $sheet->setTitle('Laporan Peminjaman');
        
        $headers = ['No', 'Peminjam ID', 'Role', 'Barang ID', 'Tanggal Pinjam', 'Tanggal Kembali', 'Tanggal Pengembalian', 'Status'];
        $sheet->fromArray($headers, null, 'A1');
        
        $sheet->getStyle('A1:H1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ]);
        
        foreach(range('A','H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        
        $row = 2;
        foreach ($laporan as $index => $item) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $item->peminjam_id);
            $sheet->setCellValue('C' . $row, ucfirst($item->role ?? '-'));
            $sheet->setCellValue('D' . $row, $item->barang_id);
            $sheet->setCellValue('E' . $row, Carbon::parse($item->tanggal_peminjam)->format('d M Y'));
            $sheet->setCellValue('F' . $row, Carbon::parse($item->tanggal_kembali)->format('d M Y'));
            $sheet->setCellValue('G' . $row, $item->tanggal_pengembalian ? Carbon::parse($item->tanggal_pengembalian)->format('d M Y') : '-');
            $sheet->setCellValue('H' . $row, ucfirst($item->status));
            
            $sheet->getStyle('A' . $row . ':H' . $row)->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC']
                    ]
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER
                ]
            ]);
            
            if ($row % 2 == 0) {
                $sheet->getStyle('A' . $row . ':H' . $row)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F3F4F6']
                    ]
                ]);
            }
            
            $row++;
        }
        
        $writer = new Xlsx($spreadsheet);
        $filename = 'laporan-peminjaman-' . date('Y-m-d-His') . '.xlsx';
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        header('Cache-Control: max-age=1');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Cache-Control: cache, must-revalidate');
        header('Pragma: public');
        
        $writer->save('php://output');
        exit;
    }

    protected function getFilteredData(Request $request)
    {
        $query = Peminjaman::query();

        if ($request->filled('tanggal_awal')) {
            $query->whereDate('tanggal_peminjam', '>=', $request->tanggal_awal);
        }
        
        if ($request->filled('tanggal_akhir')) {
            $query->whereDate('tanggal_peminjam', '<=', $request->tanggal_akhir);
        }
        
        if ($request->filled('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        return $query->latest()->get();
    }
}