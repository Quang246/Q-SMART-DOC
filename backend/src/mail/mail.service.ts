import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordEmail(to: string, username: string, password: string) {
    const mailOptions = {
      from: `"QSmartDOC" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: 'Tài khoản hệ thống QSmartDOC',
      html: `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="QSmartDOC Logo" style="height: 180px; background: #000;" />
        </div>
        <p>Chào <b>${username}</b>,</p>
        <p>Bạn đã yêu cầu đổi mật khẩu, vui lòng không cung cấp mật khẩu cho bất kỳ ai. Mật khẩu mới của bạn là:</p>
        <ul>
          <li><b>Mật khẩu:</b> ${password}</li>
        </ul>
        <p>Vui lòng đăng nhập và đổi mật khẩu sau khi sử dụng lần đầu.</p>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: path.resolve(
            __dirname,
            '..',
            '..',
            'src',
            'mail',
            'assets',
            'logo.png',
          ),
          cid: 'logo',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }
}
