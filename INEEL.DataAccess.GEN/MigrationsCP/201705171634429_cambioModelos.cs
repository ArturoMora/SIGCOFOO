namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioModelos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Avance", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto");
            DropForeignKey("CP.tab_EstadoArte", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_EstudiosEspecializados", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_InformeAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico");
            DropForeignKey("CP.tab_MapasRuta", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_PlanAnual", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_PlanAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico");
            DropForeignKey("CP.tab_Post", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_TemasInnovacion", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CP.tab_Avance", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Lineamientos", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Especialistas", new[] { "IdAdjunto" });
            DropIndex("CP.tab_EstadoArte", new[] { "adjuntoId" });
            DropIndex("CP.tab_EstudiosEspecializados", new[] { "adjuntoId" });
            DropIndex("CP.tab_InformeAnual", new[] { "idLineaInv" });
            DropIndex("CP.tab_MapasRuta", new[] { "AdjuntoId" });
            DropIndex("CP.tab_PlanAnual", new[] { "idLineaInv" });
            DropIndex("CP.tab_PlanAnual", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Post", new[] { "adjuntoId" });
            DropIndex("CP.tab_TemasInnovacion", new[] { "AdjuntoId" });
            AddColumn("CP.cat_ListaOC", "FechaRegistro", c => c.DateTime(nullable: false));
            AddColumn("CP.cat_ListaOC", "Estado", c => c.Boolean(nullable: false));
            AddColumn("CP.tab_Miembros", "idPersonas", c => c.String());
            AddColumn("CP.tab_Metas", "EstadoMeta", c => c.String());
            AddColumn("CP.tab_Comunidades", "idAjunto", c => c.Long());
            AddColumn("CP.tab_Comentarios", "PostId", c => c.Int(nullable: false));
            AddColumn("CP.tab_Especialistas", "idPersona", c => c.String());
            AlterColumn("CP.tab_Miembros", "FechaBaja", c => c.DateTime());
            AlterColumn("CP.tab_Miembros", "FechaAceptacion", c => c.DateTime());
            AlterColumn("CP.tab_Avance", "AdjuntoId", c => c.Long());
            AlterColumn("CP.tab_Resultados", "FechaEsperada", c => c.DateTime());
            AlterColumn("CP.tab_Comunidades", "FechaAlta", c => c.DateTime());
            AlterColumn("CP.tab_Lineamientos", "AdjuntoId", c => c.Long());
            AlterColumn("CP.tab_SitioInteres", "Titulo", c => c.String());
            AlterColumn("CP.tab_SitioInteres", "Descripcion", c => c.String());
            AlterColumn("CP.tab_SitioInteres", "Liga", c => c.String());
            AlterColumn("CP.tab_SitioInteres", "FechaRegistro", c => c.DateTime());
            AlterColumn("CP.tab_Especialistas", "IdAdjunto", c => c.Long());
            AlterColumn("CP.tab_Especialistas", "FechaRegistro", c => c.DateTime());
            AlterColumn("CP.tab_EstadoArte", "adjuntoId", c => c.Long());
            AlterColumn("CP.tab_EstudiosEspecializados", "adjuntoId", c => c.Long());
            AlterColumn("CP.tab_InformeAnual", "idLineaInv", c => c.Int());
            AlterColumn("CP.tab_MapasRuta", "AdjuntoId", c => c.Long());
            AlterColumn("CP.tab_PlanAnual", "idLineaInv", c => c.Int());
            AlterColumn("CP.tab_PlanAnual", "AdjuntoId", c => c.Long());
            AlterColumn("CP.tab_Post", "adjuntoId", c => c.Long());
            AlterColumn("CP.tab_TemasInnovacion", "AdjuntoId", c => c.Long());
            CreateIndex("CP.tab_Avance", "AdjuntoId");
            CreateIndex("CP.tab_Comunidades", "idAjunto");
            CreateIndex("CP.tab_Lineamientos", "AdjuntoId");
            CreateIndex("CP.tab_Comentarios", "PostId");
            CreateIndex("CP.tab_Post", "adjuntoId");
            CreateIndex("CP.tab_Especialistas", "IdAdjunto");
            CreateIndex("CP.tab_EstadoArte", "adjuntoId");
            CreateIndex("CP.tab_EstudiosEspecializados", "adjuntoId");
            CreateIndex("CP.tab_InformeAnual", "idLineaInv");
            CreateIndex("CP.tab_MapasRuta", "AdjuntoId");
            CreateIndex("CP.tab_PlanAnual", "idLineaInv");
            CreateIndex("CP.tab_PlanAnual", "AdjuntoId");
            CreateIndex("CP.tab_TemasInnovacion", "AdjuntoId");
            AddForeignKey("CP.tab_Comunidades", "idAjunto", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_Comentarios", "PostId", "CP.tab_Post", "PostId", cascadeDelete: false);
            AddForeignKey("CP.tab_Avance", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_EstadoArte", "adjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_EstudiosEspecializados", "adjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_InformeAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico", "LineaDesarrolloTecnologicoId");
            AddForeignKey("CP.tab_MapasRuta", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_PlanAnual", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_PlanAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico", "LineaDesarrolloTecnologicoId");
            AddForeignKey("CP.tab_Post", "adjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CP.tab_TemasInnovacion", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            DropColumn("CP.tab_Miembros", "NumEmp");
            DropColumn("CP.tab_Metas", "Estado");
            DropColumn("CP.tab_Comunidades", "Imagen");
        }
        
        public override void Down()
        {
            AddColumn("CP.tab_Comunidades", "Imagen", c => c.Binary());
            AddColumn("CP.tab_Metas", "Estado", c => c.String());
            AddColumn("CP.tab_Miembros", "NumEmp", c => c.String());
            DropForeignKey("CP.tab_TemasInnovacion", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Post", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_PlanAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico");
            DropForeignKey("CP.tab_PlanAnual", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_MapasRuta", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_InformeAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico");
            DropForeignKey("CP.tab_EstudiosEspecializados", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_EstadoArte", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto");
            DropForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Avance", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Comentarios", "PostId", "CP.tab_Post");
            DropForeignKey("CP.tab_Comunidades", "idAjunto", "GEN.Adjunto");
            DropIndex("CP.tab_TemasInnovacion", new[] { "AdjuntoId" });
            DropIndex("CP.tab_PlanAnual", new[] { "AdjuntoId" });
            DropIndex("CP.tab_PlanAnual", new[] { "idLineaInv" });
            DropIndex("CP.tab_MapasRuta", new[] { "AdjuntoId" });
            DropIndex("CP.tab_InformeAnual", new[] { "idLineaInv" });
            DropIndex("CP.tab_EstudiosEspecializados", new[] { "adjuntoId" });
            DropIndex("CP.tab_EstadoArte", new[] { "adjuntoId" });
            DropIndex("CP.tab_Especialistas", new[] { "IdAdjunto" });
            DropIndex("CP.tab_Post", new[] { "adjuntoId" });
            DropIndex("CP.tab_Comentarios", new[] { "PostId" });
            DropIndex("CP.tab_Lineamientos", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Comunidades", new[] { "idAjunto" });
            DropIndex("CP.tab_Avance", new[] { "AdjuntoId" });
            AlterColumn("CP.tab_TemasInnovacion", "AdjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_Post", "adjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_PlanAnual", "AdjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_PlanAnual", "idLineaInv", c => c.Int(nullable: false));
            AlterColumn("CP.tab_MapasRuta", "AdjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_InformeAnual", "idLineaInv", c => c.Int(nullable: false));
            AlterColumn("CP.tab_EstudiosEspecializados", "adjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_EstadoArte", "adjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_Especialistas", "FechaRegistro", c => c.DateTime(nullable: false));
            AlterColumn("CP.tab_Especialistas", "IdAdjunto", c => c.Long(nullable: false));
            AlterColumn("CP.tab_SitioInteres", "FechaRegistro", c => c.DateTime(nullable: false));
            AlterColumn("CP.tab_SitioInteres", "Liga", c => c.String(maxLength: 300));
            AlterColumn("CP.tab_SitioInteres", "Descripcion", c => c.String(maxLength: 300));
            AlterColumn("CP.tab_SitioInteres", "Titulo", c => c.String(maxLength: 250));
            AlterColumn("CP.tab_Lineamientos", "AdjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_Comunidades", "FechaAlta", c => c.DateTime(nullable: false));
            AlterColumn("CP.tab_Resultados", "FechaEsperada", c => c.DateTime(nullable: false));
            AlterColumn("CP.tab_Avance", "AdjuntoId", c => c.Long(nullable: false));
            AlterColumn("CP.tab_Miembros", "FechaAceptacion", c => c.DateTime(nullable: false));
            AlterColumn("CP.tab_Miembros", "FechaBaja", c => c.DateTime(nullable: false));
            DropColumn("CP.tab_Especialistas", "idPersona");
            DropColumn("CP.tab_Comentarios", "PostId");
            DropColumn("CP.tab_Comunidades", "idAjunto");
            DropColumn("CP.tab_Metas", "EstadoMeta");
            DropColumn("CP.tab_Miembros", "idPersonas");
            DropColumn("CP.cat_ListaOC", "Estado");
            DropColumn("CP.cat_ListaOC", "FechaRegistro");
            CreateIndex("CP.tab_TemasInnovacion", "AdjuntoId");
            CreateIndex("CP.tab_Post", "adjuntoId");
            CreateIndex("CP.tab_PlanAnual", "AdjuntoId");
            CreateIndex("CP.tab_PlanAnual", "idLineaInv");
            CreateIndex("CP.tab_MapasRuta", "AdjuntoId");
            CreateIndex("CP.tab_InformeAnual", "idLineaInv");
            CreateIndex("CP.tab_EstudiosEspecializados", "adjuntoId");
            CreateIndex("CP.tab_EstadoArte", "adjuntoId");
            CreateIndex("CP.tab_Especialistas", "IdAdjunto");
            CreateIndex("CP.tab_Lineamientos", "AdjuntoId");
            CreateIndex("CP.tab_Avance", "AdjuntoId");
            AddForeignKey("CP.tab_TemasInnovacion", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_Post", "adjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_PlanAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico", "LineaDesarrolloTecnologicoId", cascadeDelete: true);
            AddForeignKey("CP.tab_PlanAnual", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_MapasRuta", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_InformeAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico", "LineaDesarrolloTecnologicoId", cascadeDelete: true);
            AddForeignKey("CP.tab_EstudiosEspecializados", "adjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_EstadoArte", "adjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_Avance", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
        }
    }
}