"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function RestaurantMenu() {
  const [sections, setSections] = useState([])
  const [items, setItems] = useState({})
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      setSections(data.sections)
      setItems(data.items)
    } catch (error) {
      console.error('Error fetching menu data:', error)
    }
    setIsLoading(false)
  }

  const handleSectionClick = (section) => {
    setSelectedSection(section)
    setSelectedItem(null)
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleBackClick = () => {
    if (selectedItem) {
      setSelectedItem(null)
    } else {
      setSelectedSection(null)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Cargando...</div>
  }

  if (selectedItem) {
    return (
      <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
        <Button onClick={handleBackClick} className="mb-4">
          Volver
        </Button>
        <div className="space-y-4">
          <Image
            src={selectedItem.image.replace("80&width=80", "300&width=300")}
            alt={selectedItem.name}
            width={300}
            height={300}
            className="w-full h-auto rounded-lg"
          />
          <h1 className="text-2xl font-bold">{selectedItem.name}</h1>
          <p className="text-xl font-semibold text-primary">{selectedItem.price}</p>
          <p className="text-gray-600">{selectedItem.description}</p>
        </div>
      </div>
    )
  }

  if (selectedSection) {
    return (
      <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
        <Button onClick={handleBackClick} className="mb-4">
          Volver al Menú Principal
        </Button>
        <h1 className="text-2xl font-bold text-center mb-6">
          {selectedSection.name}
        </h1>
        {items[selectedSection.id]?.map((item) => (
          <Card key={item.id} className="overflow-hidden cursor-pointer" onClick={() => handleItemClick(item)}>
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover w-20 h-20"
                  />
                </div>
                <div className="flex-grow p-4 flex flex-col justify-center">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{item.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Nuestro Menú</h1>
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="overflow-hidden cursor-pointer"
            onClick={() => handleSectionClick(section)}
          >
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image src={section.image} alt={section.name} layout="fill" objectFit="cover" />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{section.name}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}