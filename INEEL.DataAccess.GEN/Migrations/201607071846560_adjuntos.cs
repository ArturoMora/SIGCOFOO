namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adjuntos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.Adjunto",
                c => new
                    {
                        AdjuntoId = c.Long(nullable: false, identity: true),
                        RutaCompleta = c.String(nullable: false),
                        nombre = c.String(maxLength: 100),
                        ModuloId = c.String(maxLength: 3),
                    })
                .PrimaryKey(t => t.AdjuntoId)
                .ForeignKey("GEN.cat_Modulo", t => t.ModuloId)
                .Index(t => t.ModuloId);
            
            CreateTable(
                "GEN.cat_Modulo",
                c => new
                    {
                        ModuloId = c.String(nullable: false, maxLength: 3),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.ModuloId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.Adjunto", "ModuloId", "GEN.cat_Modulo");
            DropIndex("GEN.Adjunto", new[] { "ModuloId" });
            DropTable("GEN.cat_Modulo");
            DropTable("GEN.Adjunto");
        }
    }
}
