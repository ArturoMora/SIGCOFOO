namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bdSetBitacoraSolicitudesAcceso : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_BitacoraSolicitudesAcceso",
                c => new
                    {
                        BitacoraSolicitudesAccesoId = c.Long(nullable: false, identity: true),
                        SolicitudAccesoId = c.Int(nullable: false),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersonaSolicitante = c.String(),
                        Descripcion = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                        idRol = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.BitacoraSolicitudesAccesoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.tab_BitacoraSolicitudesAcceso", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GEN.tab_BitacoraSolicitudesAcceso", new[] { "EstadoFlujoId" });
            DropTable("GEN.tab_BitacoraSolicitudesAcceso");
        }
    }
}
