namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class detallepersonas : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_DetallePersona",
                c => new
                    {
                        ClaveEmpleado = c.String(nullable: false, maxLength: 128),
                        Calle = c.String(),
                        Colonia = c.String(),
                        Ciudad = c.String(),
                        EstadoCivil = c.String(),
                        Celular = c.String(maxLength: 20),
                        Extension = c.String(maxLength: 5),
                        OrigenDatos = c.String(maxLength: 20),
                    })
                .PrimaryKey(t => t.ClaveEmpleado);
            
            DropColumn("GEN.cat_Personas", "Extension");
            DropColumn("GEN.cat_Personas", "Celular");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_Personas", "Celular", c => c.String(maxLength: 20));
            AddColumn("GEN.cat_Personas", "Extension", c => c.String(maxLength: 5));
            DropTable("GEN.tab_DetallePersona");
        }
    }
}
