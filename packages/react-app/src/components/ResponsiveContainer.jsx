import "./ResponsiveContainer.css"

export default function ResponsiveContainer({ children, ...props }) {
    return (
        <div className="responsive-container" {...props}>
            {children}
        </div>
    );
}
