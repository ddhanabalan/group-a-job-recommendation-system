import './LanguageCard.css';
export default function LanguageCard({ data }) {
    return (
        <div className="language-card">
            <p>{data.language} - {data.languageProficiency}</p>
        </div>
    )
}