import Button from '@/components/ui/Button'

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mx-4 sm:mx-0">
                    <div className="space-y-6">
                        <Button type="submit" variant="primary" className="w-full">
                            primary
                        </Button>
                        <Button type="submit" variant="light" className="">
                            light
                        </Button>
                        <Button type="submit" variant="outline" className="w-full">
                            outline
                        </Button>
                        <Button type="submit" variant="smooth" className="w-full">
                            soft
                        </Button>
                        <Button type="submit" variant="warning" className="w-full">
                            warning
                        </Button>
                        <Button type="submit" variant="warningSmooth" className="w-full">
                            warningsoft
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}