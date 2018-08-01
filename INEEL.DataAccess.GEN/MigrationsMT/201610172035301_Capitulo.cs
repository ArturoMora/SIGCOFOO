namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Capitulo : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.Capitulos", "PaisID", "CH.cat_Pais");
            DropForeignKey("MT.AdjuntoCapitulos", "AdjuntoId", "GEN.Adjunto");
            DropIndex("MT.AdjuntoCapitulos", new[] { "AdjuntoId" });
            DropIndex("MT.Capitulos", new[] { "PaisID" });
            CreateTable(
                "MT.cat_EstadoCapitulo",
                c => new
                    {
                        EstadoCapituloId = c.Int(nullable: false, identity: true),
                        FechaEfectiva = c.DateTime(nullable: false),
                        Descripcion = c.String(maxLength: 200),
                        DescripcionCorta = c.String(maxLength: 50),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoCapituloId);
            
            AddColumn("MT.Capitulos", "Pais", c => c.String(maxLength: 150));
            AddColumn("MT.Capitulos", "Year", c => c.String(maxLength: 30));
            AddColumn("MT.Capitulos", "AdjuntoId", c => c.Long());
            AddColumn("MT.Capitulos", "EstadoFlujoId", c => c.Int(nullable: false));
            AddColumn("MT.Capitulos", "FechaValidacion", c => c.DateTime());
            AddColumn("MT.Capitulos", "EstadoCapituloId", c => c.Int(nullable: false));
            AlterColumn("MT.AdjuntoCapitulos", "AdjuntoId", c => c.Long());
            CreateIndex("MT.AdjuntoCapitulos", "AdjuntoId");
            CreateIndex("MT.Capitulos", "AdjuntoId");
            CreateIndex("MT.Capitulos", "EstadoFlujoId");
            CreateIndex("MT.Capitulos", "EstadoCapituloId");
            AddForeignKey("MT.Capitulos", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo", "EstadoCapituloId", cascadeDelete: true);
            AddForeignKey("MT.Capitulos", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("MT.AdjuntoCapitulos", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            DropColumn("MT.Capitulos", "PaisID");
            DropColumn("MT.Capitulos", "Anio");
        }
        
        public override void Down()
        {
            AddColumn("MT.Capitulos", "Anio", c => c.Int(nullable: false));
            AddColumn("MT.Capitulos", "PaisID", c => c.Int(nullable: false));
            DropForeignKey("MT.AdjuntoCapitulos", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("MT.Capitulos", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo");
            DropForeignKey("MT.Capitulos", "AdjuntoId", "GEN.Adjunto");
            DropIndex("MT.Capitulos", new[] { "EstadoCapituloId" });
            DropIndex("MT.Capitulos", new[] { "EstadoFlujoId" });
            DropIndex("MT.Capitulos", new[] { "AdjuntoId" });
            DropIndex("MT.AdjuntoCapitulos", new[] { "AdjuntoId" });
            AlterColumn("MT.AdjuntoCapitulos", "AdjuntoId", c => c.Long(nullable: false));
            DropColumn("MT.Capitulos", "EstadoCapituloId");
            DropColumn("MT.Capitulos", "FechaValidacion");
            DropColumn("MT.Capitulos", "EstadoFlujoId");
            DropColumn("MT.Capitulos", "AdjuntoId");
            DropColumn("MT.Capitulos", "Year");
            DropColumn("MT.Capitulos", "Pais");
            DropTable("MT.cat_EstadoCapitulo");
            CreateIndex("MT.Capitulos", "PaisID");
            CreateIndex("MT.AdjuntoCapitulos", "AdjuntoId");
            AddForeignKey("MT.AdjuntoCapitulos", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("MT.Capitulos", "PaisID", "CH.cat_Pais", "PaisID", cascadeDelete: true);
        }
    }
}
