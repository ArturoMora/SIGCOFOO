namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SoyAlan2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_BitacoraSolicitudes",
                c => new
                    {
                        BitacoraSolicitudesId = c.Long(nullable: false, identity: true),
                        SolicitudId = c.Int(nullable: false),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Descripcion = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                        idRol = c.Int(),
                    })
                .PrimaryKey(t => t.BitacoraSolicitudesId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.tab_BitacoraSolicitudes", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GEN.tab_BitacoraSolicitudes", new[] { "EstadoFlujoId" });
            DropTable("GEN.tab_BitacoraSolicitudes");
        }
    }
}
