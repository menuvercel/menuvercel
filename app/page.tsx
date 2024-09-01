"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import RestaurantMenu from "./components/RestaurantMenu"
import AdminPanel from "./components/AdminPanel"
import { useRouter } from "next/navigation"

export default function Home() {
  const [sections, setSections] = useState([])
  const [items, setItems] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const router = useRouter()

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

  const handleAddSection = async (newSection) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', data: newSection }),
      })
      const addedSection = await response.json()
      setSections([...sections, addedSection])
      setItems({ ...items, [addedSection.id]: [] })
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const handleUpdateSection = async (updatedSection) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', id: updatedSection.id, data: updatedSection }),
      })
      const updated = await response.json()
      setSections(sections.map(s => s.id === updated.id ? updated : s))
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const handleDeleteSection = async (sectionId) => {
    try {
      await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', id: sectionId }),
      })
      setSections(sections.filter(s => s.id !== sectionId))
      const newItems = { ...items }
      delete newItems[sectionId]
      setItems(newItems)
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const handleAddItem = async (sectionId, newItem) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', data: newItem }),
      })
      const addedItem = await response.json()
      setItems(prevItems => ({
        ...prevItems,
        [sectionId]: [...(prevItems[sectionId] || []), addedItem]
      }))
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async (updatedItem) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', id: updatedItem.id, data: updatedItem }),
      })
      const updated = await response.json()
      setItems(prevItems => ({
        ...prevItems,
        [updated.section_id]: prevItems[updated.section_id].map(i => i.id === updated.id ? updated : i)
      }))
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (itemId, sectionId) => {
    try {
      await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', id: itemId }),
      })
      setItems(prevItems => ({
        ...prevItems,
        [sectionId]: prevItems[sectionId].filter(i => i.id !== itemId)
      }))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Cargando...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Nuestro Restaurante</h1>
          <Button onClick={() => setIsAdminMode(!isAdminMode)}>
            {isAdminMode ? "Ver Menú" : "Modo Admin"}
          </Button>
        </div>
        
        {isAdminMode ? (
          <AdminPanel
            sections={sections}
            items={items}
            onAddSection={handleAddSection}
            onUpdateSection={handleUpdateSection}
            onDeleteSection={handleDeleteSection}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ) : (
          <RestaurantMenu
            sections={sections}
            items={items}
          />
        )}
      </div>
    </main>
  )
}