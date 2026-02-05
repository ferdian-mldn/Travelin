<!DOCTYPE html>
<html>
<head>
    <title>Kwitansi Pembayaran - Travelin</title>
    <style>
        body { font-family: sans-serif; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 5px; }
        .total-box { background: #f3f4f6; padding: 10px; text-align: right; font-weight: bold; border-radius: 5px; }
        .status-paid { color: green; font-weight: bold; border: 1px solid green; padding: 5px 10px; display: inline-block; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">TRAVELIN</div>
        <p>Official Receipt</p>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>Order ID:</strong><br>TRX-{{ $booking->id }}</td>
            <td style="text-align: right;"><strong>Tanggal:</strong><br>{{ $booking->created_at->format('d M Y') }}</td>
        </tr>
        <tr>
            <td colspan="2"><br><strong>Pelanggan:</strong><br>{{ $booking->user->name }} ({{ $booking->user->email }})</td>
        </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #eee;">
            <th style="padding: 10px; text-align: left;">Paket Wisata</th>
            <th style="padding: 10px; text-align: right;">Harga</th>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                {{ $booking->tour->name }}<br>
                <small>{{ $booking->quantity }} Pax</small>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                Rp {{ number_format($booking->total_price, 0, ',', '.') }}
            </td>
        </tr>
    </table>

    <div class="total-box" style="margin-top: 20px;">
        Total Bayar: Rp {{ number_format($booking->total_price, 0, ',', '.') }}
    </div>

    <div style="margin-top: 30px; text-align: center;">
        <span class="status-paid">LUNAS / PAID</span>
        <p style="font-size: 12px; color: #777; margin-top: 10px;">Terima kasih telah berpetualang bersama Travelin.</p>
    </div>
</body>
</html>