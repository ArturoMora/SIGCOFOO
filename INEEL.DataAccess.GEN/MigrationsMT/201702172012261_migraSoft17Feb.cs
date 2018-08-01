namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraSoft17Feb : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware");
            DropIndex("MT.SoftwarePersonal", new[] { "ProyectoId" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoSoftwareId" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualTecnico" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualUsuario" });
            DropIndex("MT.SoftwarePersonal", new[] { "CodigoFuente" });
            AddColumn("MT.SoftwarePersonal", "GerenciaClave", c => c.String());
            AddColumn("MT.SoftwarePersonal", "ClavePersona", c => c.String());
            AddColumn("MT.SoftwarePersonal", "FechaValidacion", c => c.DateTime());
            AddColumn("MT.SoftwarePersonal", "EstadoFlujoId", c => c.Int());
            AlterColumn("MT.SoftwarePersonal", "ProyectoId", c => c.String(maxLength: 10));
            AlterColumn("MT.SoftwarePersonal", "NumeroVersion", c => c.Single());
            AlterColumn("MT.SoftwarePersonal", "AnioVersion", c => c.Int());
            AlterColumn("MT.SoftwarePersonal", "DescripcionFuncional", c => c.String(unicode: false));
            AlterColumn("MT.SoftwarePersonal", "PlataformaDesarrollo", c => c.String(unicode: false));
            AlterColumn("MT.SoftwarePersonal", "TipoSoftwareId", c => c.Int());
            AlterColumn("MT.SoftwarePersonal", "Comentarios", c => c.String(unicode: false));
            AlterColumn("MT.SoftwarePersonal", "ManualTecnico", c => c.Long());
            AlterColumn("MT.SoftwarePersonal", "ManualUsuario", c => c.Long());
            AlterColumn("MT.SoftwarePersonal", "CodigoFuente", c => c.Long());
            CreateIndex("MT.SoftwarePersonal", "ProyectoId");
            CreateIndex("MT.SoftwarePersonal", "TipoSoftwareId");
            CreateIndex("MT.SoftwarePersonal", "ManualTecnico");
            CreateIndex("MT.SoftwarePersonal", "ManualUsuario");
            CreateIndex("MT.SoftwarePersonal", "CodigoFuente");
            CreateIndex("MT.SoftwarePersonal", "EstadoFlujoId");
            AddForeignKey("MT.SoftwarePersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
            AddForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos", "ProyectoId");
            AddForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware", "TipoSoftwareId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware");
            DropForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("MT.SoftwarePersonal", new[] { "EstadoFlujoId" });
            DropIndex("MT.SoftwarePersonal", new[] { "CodigoFuente" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualUsuario" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualTecnico" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoSoftwareId" });
            DropIndex("MT.SoftwarePersonal", new[] { "ProyectoId" });
            AlterColumn("MT.SoftwarePersonal", "CodigoFuente", c => c.Long(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "ManualUsuario", c => c.Long(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "ManualTecnico", c => c.Long(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "Comentarios", c => c.String(nullable: false, unicode: false));
            AlterColumn("MT.SoftwarePersonal", "TipoSoftwareId", c => c.Int(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "PlataformaDesarrollo", c => c.String(nullable: false, unicode: false));
            AlterColumn("MT.SoftwarePersonal", "DescripcionFuncional", c => c.String(nullable: false, unicode: false));
            AlterColumn("MT.SoftwarePersonal", "AnioVersion", c => c.Int(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "NumeroVersion", c => c.Single(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "ProyectoId", c => c.String(nullable: false, maxLength: 10));
            DropColumn("MT.SoftwarePersonal", "EstadoFlujoId");
            DropColumn("MT.SoftwarePersonal", "FechaValidacion");
            DropColumn("MT.SoftwarePersonal", "ClavePersona");
            DropColumn("MT.SoftwarePersonal", "GerenciaClave");
            CreateIndex("MT.SoftwarePersonal", "CodigoFuente");
            CreateIndex("MT.SoftwarePersonal", "ManualUsuario");
            CreateIndex("MT.SoftwarePersonal", "ManualTecnico");
            CreateIndex("MT.SoftwarePersonal", "TipoSoftwareId");
            CreateIndex("MT.SoftwarePersonal", "ProyectoId");
            AddForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware", "TipoSoftwareId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos", "ProyectoId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
        }
    }
}
