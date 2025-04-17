module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('Addresses', [
            {
                address_id: 1,
                user_id: 1,
                recipient_name: 'Nguyễn Văn A',
                phone: '0123456789',
                address_line: '123 Đường ABC',
                city: 'Hà Nội',
                province: 'Hà Nội',
                postal_code: '100000',
                is_default: true
            },
            {
                address_id: 2,
                user_id: 2,
                recipient_name: 'Trần Thị B',
                phone: '0987654321',
                address_line: '456 Đường XYZ',
                city: 'Hồ Chí Minh',
                province: 'Hồ Chí Minh',
                postal_code: '700000',
                is_default: true
            },
            {
                address_id: 3,
                user_id: 3,
                recipient_name: 'Lê Văn C',
                phone: '0369852147',
                address_line: '789 Đường DEF',
                city: 'Đà Nẵng',
                province: 'Đà Nẵng',
                postal_code: '550000',
                is_default: true
            },
            {
                address_id: 4,
                user_id: 4,
                recipient_name: 'Phạm Thị D',
                phone: '0587412369',
                address_line: '321 Đường GHI',
                city: 'Hải Phòng',
                province: 'Hải Phòng',
                postal_code: '180000',
                is_default: true,

            },
            {
                address_id: 5,
                user_id: 5,
                recipient_name: 'Hoàng Văn E',
                phone: '0741258963',
                address_line: '654 Đường KLM',
                city: 'Cần Thơ',
                province: 'Cần Thơ',
                postal_code: '900000',
                is_default: true,

            },
            {
                address_id: 6,
                user_id: 6,
                recipient_name: 'Vũ Thị F',
                phone: '0852147963',
                address_line: '987 Đường NOP',
                city: 'Hà Nội',
                province: 'Hà Nội',
                postal_code: '100000',
                is_default: true,

            },
            {
                address_id: 7,
                user_id: 7,
                recipient_name: 'Đặng Văn G',
                phone: '0963258741',
                address_line: '147 Đường QRS',
                city: 'Hồ Chí Minh',
                province: 'Hồ Chí Minh',
                postal_code: '700000',
                is_default: true,

            },
            {
                address_id: 8,
                user_id: 8,
                recipient_name: 'Bùi Thị H',
                phone: '0321456987',
                address_line: '258 Đường TUV',
                city: 'Đà Nẵng',
                province: 'Đà Nẵng',
                postal_code: '550000',
                is_default: true,

            },
            {
                address_id: 9,
                user_id: 9,
                recipient_name: 'Mai Văn I',
                phone: '0789632145',
                address_line: '369 Đường WXY',
                city: 'Hải Phòng',
                province: 'Hải Phòng',
                postal_code: '180000',
                is_default: true,

            },
            {
                address_id: 10,
                user_id: 10,
                recipient_name: 'Lý Thị K',
                phone: '0147852369',
                address_line: '741 Đường ZAB',
                city: 'Cần Thơ',
                province: 'Cần Thơ',
                postal_code: '900000',
                is_default: true,

            },
            {
                address_id: 11,
                user_id: 11,
                recipient_name: 'Ngô Văn L',
                phone: '0963258741',
                address_line: '852 Đường CDE',
                city: 'Hà Nội',
                province: 'Hà Nội',
                postal_code: '100000',
                is_default: true,

            },
            {
                address_id: 12,
                user_id: 12,
                recipient_name: 'Đỗ Thị M',
                phone: '0321456987',
                address_line: '963 Đường FGH',
                city: 'Hồ Chí Minh',
                province: 'Hồ Chí Minh',
                postal_code: '700000',
                is_default: true,

            },
            {
                address_id: 13,
                user_id: 13,
                recipient_name: 'Trịnh Văn N',
                phone: '0789632145',
                address_line: '159 Đường IJK',
                city: 'Đà Nẵng',
                province: 'Đà Nẵng',
                postal_code: '550000',
                is_default: true,

            },
            {
                address_id: 14,
                user_id: 14,
                recipient_name: 'Lưu Thị O',
                phone: '0147852369',
                address_line: '357 Đường LMN',
                city: 'Hải Phòng',
                province: 'Hải Phòng',
                postal_code: '180000',
                is_default: true,

            },
            {
                address_id: 15,
                user_id: 15,
                recipient_name: 'Hồ Văn P',
                phone: '0963258741',
                address_line: '456 Đường OPQ',
                city: 'Cần Thơ',
                province: 'Cần Thơ',
                postal_code: '900000',
                is_default: true,

            },
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Addresses', null, {});
    },
}; 