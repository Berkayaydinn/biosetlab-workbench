// Bu dosya, @ant-design/icons'dan yapılan tüm import isteklerini yakalar
// ve istenen her ikon için basit, sahte bir React bileşeni döndürür.
const React = require('react');

// İstenen her bir ikon için (örn: FileOutlined), props alabilen
// ve içinde ikonun adını barındıran basit bir <span> döndürüyoruz.
// Bu, testlerin JSX veya SVG nedeniyle hata vermesini engeller.
module.exports = new Proxy({}, {
    get: function (target, prop) {
        return (props) => React.createElement('span', { ...props, 'data-icon-name': prop });
    }
});