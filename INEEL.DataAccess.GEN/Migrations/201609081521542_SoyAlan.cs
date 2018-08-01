namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SoyAlan : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.tab_BitacoraSolicitudes", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GEN.tab_BitacoraSolicitudes", new[] { "EstadoFlujoId" });
            DropTable("GEN.tab_BitacoraSolicitudes");
        }
        
        public override void Down()
        {
            CreateTable(
                "GEN.tab_BitacoraSolicitudes",
                c => new
                    {
                        BitacoraSolicitudesId = c.Int(nullable: false, identity: true),
                        SolicitudId = c.Int(nullable: false),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Descripcion = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.BitacoraSolicitudesId);
            
            CreateIndex("GEN.tab_BitacoraSolicitudes", "EstadoFlujoId");
            AddForeignKey("GEN.tab_BitacoraSolicitudes", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
    }
}
